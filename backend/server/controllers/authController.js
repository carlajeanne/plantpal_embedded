import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {mainDB} from '../config/db.js';

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

function validatePassword(password) {
    return password.length >= 8 && /[0-9!@#$%^&*]/.test(password);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const register = async (req, res) => {
    let connection;
    try {
        const { email, password, full_name} = req.body;
        
        if (!email || !password || !full_name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain a number or special character.' });
        }

        connection = await mainDB();

        const [existingUser] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [userResult] = await connection.query(
            "INSERT INTO users (email, password, full_name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [email, hashedPassword, full_name]
        );

        const userId = userResult.insertId;

        // Removed the problematic second INSERT statement
        
        res.status(201).json({ message: 'Registration successful. Please verify your account.', user_id: userId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: `An error occurred during registration: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};
export const login = async (req, res) => {
    let connection;
    try {
        const { email, password } = req.body;
        connection = await mainDB();
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connection.query(sql, [email]);

        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '24h' });
        const refresh_token = jwt.sign({ id: user.id, email: user.email }, refreshSecretKey);

        const updateSql = 'UPDATE users SET refresh_token = ?, last_login = NOW() WHERE id = ?';
        await connection.query(updateSql, [refresh_token, user.id]);

        res.json({ 
            token, 
            refresh_token, 
            id: user.id, 
            role: user.role,
            full_name: user.full_name 
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error logging in' });
    } finally {
        if (connection) connection.end();
    }
};

export const refresh_token = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(401).send('Refresh token is required');
    }
    let connection;
    try {
        const decoded = jwt.verify(refresh_token, refreshSecretKey);
        connection = await mainDB();
        const sql = 'SELECT * FROM users WHERE id = ? AND refresh_token = ?';
        const [results] = await connection.query(sql, [decoded.id, refresh_token]);

        if (results.length === 0) {
            return res.status(403).send('Invalid refresh token');
        }

        const user = results[0];
        const newToken = jwt.sign({ id: user.id, email: user.email}, secretKey, { expiresIn: '24h' });

        res.json({ token: newToken });
    } catch (error) {
        res.status(403).send('Invalid refresh token');
    } finally {
        if (connection) connection.end();
    }
};

export const verify_token = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let connection;
    try {
        const decoded = jwt.verify(token, secretKey);
        return res.status(200).json({ message: "Token is valid", user: decoded });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    } finally {
        if (connection) connection.end();
    }
};

export const protectedRoute = (req, res) => {
    const { email } = req.user;
    res.send(`Welcome ${email}! This is a protected route.`);
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    let connection;
    try {
        connection = await mainDB();

        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connection.query(sql, [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const user = results[0];

        const resetToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset link. Please try again later.' });
    } finally {
        if (connection) connection.end();
    }
};
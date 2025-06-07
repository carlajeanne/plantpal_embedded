import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CircleAlert, Mail, Lock } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // Simulated saved email check
        const savedEmail = ''; // In real app: localStorage.getItem('savedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Login failed: ${errorMessage}`);
            }

            const data = await response.json();
            if (data.refresh_token) {
                localStorage.setItem('token', data.refresh_token);
                localStorage.setItem('user_id', data.id);
                localStorage.setItem('role', data.role);

                if (rememberMe) {
                    localStorage.setItem('savedEmail', email);
                } else {
                    localStorage.removeItem('savedEmail');
                }

                navigate('/Dashboard');
            } else {
                setError("Something went wrong. No token received.");
            }
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
            setTimeout(() => setError(''), 4000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            {/* Main login container */}
            <div className="relative w-full max-w-md z-10">
                {/* Glassmorphism card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-gray-300">
                            Sign in to your <span className="text-red-400 font-semibold">PLANTPAL</span>
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 backdrop-blur-sm">
                            <CircleAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Login form */}
                    <div className="space-y-6">
                        {/* Email field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    {passwordVisible ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me and forgot password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-red-500 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span>Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate('/forgotPassword')}
                                className="text-red-400 hover:text-red-300 transition-colors hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit button */}
                        <button
                            type="button"
                            onClick={handleFormSubmit}
                            disabled={isLoading || !email || !password}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Sign up link */}
                        <div className="text-center text-sm text-gray-300">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/SignUp')}
                                className="text-red-400 hover:text-red-300 font-medium transition-colors hover:underline"
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-full blur-xl"></div>
            </div>
        </div>
    );
}
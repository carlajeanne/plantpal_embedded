import { mainDB } from '../config/db.js';

// Function to save soil moisture reading to database
export const saveSoilMoisture = async (req, res) => {
  let connection;
  
  try {
    const { moisture_level, device_id } = req.body;
    
    // Validate input
    if (moisture_level === undefined || moisture_level === null) {
      return res.status(400).json({ error: 'moisture_level is required' });
    }
    
    // Connect to database
    connection = await mainDB();
    
    // Insert soil moisture reading with current timestamp
    const [result] = await connection.query(`
      INSERT INTO soil_moisture (moisture_level, reading_timestamp) 
      VALUES (?, NOW())
    `, [moisture_level]);
    
    console.log(`Soil moisture saved: ${moisture_level}% at ${new Date().toISOString()}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Soil moisture reading saved successfully',
      id: result.insertId,
      moisture_level: moisture_level,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error saving soil moisture reading:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

// Function to get recent soil moisture readings
export const getSoilMoistureReadings = async (req, res) => {
  let connection;
  
  try {
    const { limit = 50, hours = 24 } = req.query;
    
    connection = await mainDB();
    
    // Get recent readings within specified hours
    const [readings] = await connection.query(`
      SELECT id, moisture_level, reading_timestamp 
      FROM soil_moisture 
      WHERE reading_timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
      ORDER BY reading_timestamp DESC 
      LIMIT ?
    `, [parseInt(hours), parseInt(limit)]);
    
    res.status(200).json({
      success: true,
      count: readings.length,
      readings: readings
    });
    
  } catch (error) {
    console.error('Error fetching soil moisture readings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

// Function to get latest soil moisture reading
export const getLatestSoilMoisture = async (req, res) => {
  let connection;
  
  try {
    connection = await mainDB();
    
    const [latest] = await connection.query(`
      SELECT id, moisture_level, reading_timestamp 
      FROM soil_moisture 
      ORDER BY reading_timestamp DESC 
      LIMIT 1
    `);
    
    if (latest.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No soil moisture readings found' 
      });
    }
    
    res.status(200).json({
      success: true,
      latest_reading: latest[0]
    });
    
  } catch (error) {
    console.error('Error fetching latest soil moisture reading:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

// Function to get soil moisture statistics
export const getSoilMoistureStats = async (req, res) => {
  let connection;
  
  try {
    const { hours = 24 } = req.query;
    
    connection = await mainDB();
    
    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total_readings,
        AVG(CAST(moisture_level AS DECIMAL(5,2))) as avg_moisture,
        MIN(CAST(moisture_level AS DECIMAL(5,2))) as min_moisture,
        MAX(CAST(moisture_level AS DECIMAL(5,2))) as max_moisture,
        MIN(reading_timestamp) as earliest_reading,
        MAX(reading_timestamp) as latest_reading
      FROM soil_moisture 
      WHERE reading_timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
    `, [parseInt(hours)]);
    
    res.status(200).json({
      success: true,
      period_hours: parseInt(hours),
      statistics: stats[0]
    });
    
  } catch (error) {
    console.error('Error fetching soil moisture statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};
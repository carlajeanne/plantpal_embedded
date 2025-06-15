import express from 'express';
import {
  saveSoilMoisture,
  getSoilMoistureReadings,
  getLatestSoilMoisture,
  getSoilMoistureStats
} from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/save', saveSoilMoisture);
router.get('/readings', getSoilMoistureReadings);
router.get('/latest', getLatestSoilMoisture);
router.get('/stats', getSoilMoistureStats);

export default router;


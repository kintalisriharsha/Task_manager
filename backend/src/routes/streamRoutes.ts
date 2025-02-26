// src/routes/streamRoutes.ts

import { Router } from 'express';
import streamController from '../controllers/streamController';

const router = Router();

// Streaming data route
router.get('/', streamController.getStreamingData);

export default router;
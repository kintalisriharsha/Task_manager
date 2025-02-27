// src/routes/streamRoutes.ts
import { Router } from 'express';
import streamController from '../controllers/streamController';

const router = Router();

// Stream data route
router.get('/', streamController.getStreamingData);

export default router;
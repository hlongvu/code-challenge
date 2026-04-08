import { Router } from 'express';
import resourceRoutes from './resources';

const router = Router();

// Mount resource routes
router.use('/resources', resourceRoutes);

export default router;

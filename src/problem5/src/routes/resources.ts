import { Router } from 'express';
import { resourceController } from '../controllers/resourceController';

const router = Router();

// Create a new resource
router.post('/', (req, res) => resourceController.create(req, res));

// List resources with filters
router.get('/', (req, res) => resourceController.getAll(req, res));

// Get resource details by ID
router.get('/:id', (req, res) => resourceController.getById(req, res));

// Update resource details
router.put('/:id', (req, res) => resourceController.update(req, res));

// Delete a resource
router.delete('/:id', (req, res) => resourceController.delete(req, res));

export default router;

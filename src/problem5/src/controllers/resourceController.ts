import { Request, Response } from 'express';
import { resourceService } from '../services/resourceService';
import { Resource, CreateResourceRequest, UpdateResourceRequest, ResourceFilters, ApiResponse, PaginatedResponse } from '../types';

export class ResourceController {
  /**
   * Create a new resource
   */
  async create(req: Request, res: Response) {
    try {
      const data: CreateResourceRequest = req.body;

      // Validation
      if (!data.name) {
        return res.status(400).json({
          success: false,
          error: 'Name is required'
        });
      }

      const resource = await resourceService.createResource(data);

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: resource
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create resource'
      });
    }
  }

  /**
   * Get all resources with filters and pagination
   */
  async getAll(req: Request, res: Response) {
    try {
      const filters: ResourceFilters = {
        category: req.query.category as string | undefined,
        status: req.query.status as 'active' | 'inactive' | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10
      };

      const result = await resourceService.getAllResources(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resources'
      });
    }
  }

  /**
   * Get a resource by ID
   */
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid resource ID'
        } );
      }

      const resource = await resourceService.getResourceById(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        } );
      }

      res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resource'
      });
    }
  }

  /**
   * Update a resource
   */
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid resource ID'
        } );
      }

      const data: UpdateResourceRequest = req.body;
      const resource = await resourceService.updateResource(id, data);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: resource
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'No fields to update') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      console.error('Error updating resource:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update resource'
      } );
    }
  }

  /**
   * Delete a resource
   */
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid resource ID'
        });
      }

      const deleted = await resourceService.deleteResource(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        } );
      }

      res.json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete resource'
      });
    }
  }
}

export const resourceController = new ResourceController();

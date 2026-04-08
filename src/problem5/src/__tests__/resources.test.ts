import request from 'supertest';
import { app } from '../index';
import { AppDataSource } from '../data-source';
import { Resource } from '../entities/Resource';

describe('Resources API', () => {
  let resourceRepository: ReturnType<typeof AppDataSource.getRepository<Resource>>;

  beforeAll(() => {
    resourceRepository = AppDataSource.getRepository(Resource);
  });

  describe('POST /api/resources', () => {
    it('should create a new resource with all fields', async () => {
      const resourceData = {
        name: 'Test Resource',
        description: 'This is a test resource',
        category: 'test-category',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(resourceData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Resource created successfully',
        data: {
          name: resourceData.name,
          description: resourceData.description,
          category: resourceData.category,
          status: resourceData.status
        }
      });

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');
    });

    it('should create a resource with default status when not provided', async () => {
      const resourceData = {
        name: 'Test Resource Default Status',
        description: 'This is a test resource',
        category: 'test-category'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(resourceData)
        .expect(201);

      expect(response.body.data.status).toBe('active');
    });

    it('should return 400 when name is missing', async () => {
      const resourceData = {
        description: 'This is a test resource',
        category: 'test-category'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(resourceData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Name is required'
      });
    });

    it('should return 400 when name is empty string', async () => {
      const resourceData = {
        name: '',
        description: 'This is a test resource',
        category: 'test-category'
      };

      const response = await request(app)
        .post('/api/resources')
        .send(resourceData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Name is required'
      });
    });
  });

  describe('GET /api/resources', () => {
    beforeEach(async () => {
      // Create test resources
      const resources = [
        {
          name: 'Resource 1',
          description: 'Description 1',
          category: 'category-a',
          status: 'active' as const
        },
        {
          name: 'Resource 2',
          description: 'Description 2',
          category: 'category-a',
          status: 'inactive' as const
        },
        {
          name: 'Resource 3',
          description: 'Description 3',
          category: 'category-b',
          status: 'active' as const
        }
      ];

      for (const resource of resources) {
        await resourceRepository.save(resource);
      }
    });

    it('should get all resources with pagination', async () => {
      const response = await request(app)
        .get('/api/resources')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1
        }
      });

      expect(response.body.data).toHaveLength(3);
    });

    it('should filter resources by category', async () => {
      const response = await request(app)
        .get('/api/resources?category=category-a')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((r: Resource) => r.category === 'category-a')).toBe(true);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter resources by status', async () => {
      const response = await request(app)
        .get('/api/resources?status=active')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((r: Resource) => r.status === 'active')).toBe(true);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should search resources by name', async () => {
      const response = await request(app)
        .get('/api/resources?search=Resource%201')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Resource 1');
    });

    it('should search resources by description', async () => {
      const response = await request(app)
        .get('/api/resources?search=Description%202')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Resource 2');
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/resources?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2
      });
    });

    it('should return empty array when no resources match', async () => {
      const response = await request(app)
        .get('/api/resources?category=nonexistent')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/resources/:id', () => {
    let createdResource: Resource;

    beforeEach(async () => {
      createdResource = await resourceRepository.save({
        name: 'Test Resource',
        description: 'Test Description',
        category: 'test-category',
        status: 'active'
      });
    });

    it('should get a resource by ID', async () => {
      const response = await request(app)
        .get(`/api/resources/${createdResource.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: createdResource.id,
          name: createdResource.name,
          description: createdResource.description,
          category: createdResource.category,
          status: createdResource.status
        }
      });
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .get('/api/resources/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Resource not found'
      });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/resources/invalid-id')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid resource ID'
      });
    });
  });

  describe('PUT /api/resources/:id', () => {
    let createdResource: Resource;

    beforeEach(async () => {
      createdResource = await resourceRepository.save({
        name: 'Original Name',
        description: 'Original Description',
        category: 'original-category',
        status: 'active'
      });
    });

    it('should update a resource completely', async () => {
      const updateData = {
        name: 'Updated Name',
        description: 'Updated Description',
        category: 'updated-category',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/resources/${createdResource.id}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Resource updated successfully',
        data: {
          id: createdResource.id,
          ...updateData
        }
      });
    });

    it('should partially update a resource', async () => {
      const updateData = {
        name: 'Only Name Updated'
      };

      const response = await request(app)
        .put(`/api/resources/${createdResource.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(createdResource.description);
      expect(response.body.data.category).toBe(createdResource.category);
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .put('/api/resources/99999')
        .send({ name: 'New Name' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Resource not found'
      });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .put('/api/resources/invalid-id')
        .send({ name: 'New Name' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid resource ID'
      });
    });

    it('should return 400 when no fields provided', async () => {
      const response = await request(app)
        .put(`/api/resources/${createdResource.id}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'No fields to update'
      });
    });
  });

  describe('DELETE /api/resources/:id', () => {
    let createdResource: Resource;

    beforeEach(async () => {
      createdResource = await resourceRepository.save({
        name: 'Resource to Delete',
        description: 'Will be deleted',
        category: 'test-category',
        status: 'active'
      });
    });

    it('should delete a resource', async () => {
      const response = await request(app)
        .delete(`/api/resources/${createdResource.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Resource deleted successfully'
      });

      // Verify resource is deleted
      const getResponse = await request(app)
        .get(`/api/resources/${createdResource.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent resource', async () => {
      const response = await request(app)
        .delete('/api/resources/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Resource not found'
      });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/resources/invalid-id')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid resource ID'
      });
    });
  });
});

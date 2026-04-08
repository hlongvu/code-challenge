import request from 'supertest';
import { app } from '../index';

describe('Health Endpoint', () => {
  describe('GET /health', () => {
    it('should return status OK and timestamp', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.timestamp).toBeDefined();
      
      // Verify timestamp is a valid ISO string
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });

    it('should return consistent status format', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        timestamp: expect.any(String)
      });
    });
  });
});

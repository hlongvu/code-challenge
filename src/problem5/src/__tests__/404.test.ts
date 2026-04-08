import request from 'supertest';
import { app } from '../index';

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/non-existent-route')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: 'Endpoint not found'
    });
  });

  it('should return 404 for non-existent API routes', async () => {
    const response = await request(app)
      .get('/api/non-existent-endpoint')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: 'Endpoint not found'
    });
  });

  it('should return 404 for non-existent HTTP methods on existing routes', async () => {
    const response = await request(app)
      .patch('/api/resources/1')
      .send({ name: 'test' })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: 'Endpoint not found'
    });
  });
});

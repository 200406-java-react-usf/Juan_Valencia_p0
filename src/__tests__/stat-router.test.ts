const request = require('supertest');
const app = require('..');

describe('Get Endpoints', () => {

  it('should fetch stats', async () => {
    const res = await request(app)
      .get('/stats');      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('stats');
  })
})
import app from '../server';
import supertest from 'supertest';

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const result = await supertest(app).get('/');
    expect(result.status).toEqual(200);
  });
});

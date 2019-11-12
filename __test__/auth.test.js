const request = require('supertest')
const app = require('../app')
describe('Post Endpoints', () => {
  it('should create a new user', async () => {
    const user = {
      "name": "herotran210",
      "email": "herotran1" + Math.floor((Math.random() * 10000) + 1) + "@gmail.com",
      "password": "123456"
    }
    const res = await request(app)
      .post('/api/user/register')
      .send(user)
    expect(res.statusCode).toEqual(201)
    expect(res.body.status).toEqual(true)
  })
  it('returns all users', async () => {
    const response = await request(app).get('/api/user/list');
    expect(response.body).toMatchSnapshot();
  });
})
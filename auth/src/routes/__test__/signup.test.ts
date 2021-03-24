import request from 'supertest';
import { app } from '../../app';

it('return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('returns a 400 on invalid signup credentials', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@', password: 'password' })
    .expect(400);
});

it('returns a 400 with no email or password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('returns a 400 on with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);
});

it('it disallows signup with duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('sets a cookie on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

const request = require('supertest');
const { sequelize } = require('../models');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const router = require('../router');
const { describe } = require('node:test');

app.use(express.json());
app.use(cookieParser());
app.use(router);

let authCookie;
let userId;

//I combined 2 beforeAlls in one
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Register and login a user to get the auth cookie
  const response = await request(app)
    .post('/register')
    .send({ email: 'test1@email.com', password: '123', firstName: 'John', lastName: 'Doe' });

  userId = response.body.userId;

  const loginResponse = await request(app).post('/login').send({ email: 'test1@email.com', password: '123' });

  authCookie = loginResponse.headers['set-cookie'].pop().split(';')[0];
});

afterAll(async () => {
  await sequelize.close();
});

describe('Register new user, login, auth and logout', () => {
  it('should save a new user and return the userId', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test2@email.com', password: '123', firstName: 'John', lastName: 'Doe' });
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('userId', 2);
  });

  it('should login, set a cookie with the session and return the userId', async () => {
    const response = await request(app).post('/login').send({ email: 'test2@email.com', password: '123' });
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toBeInstanceOf(Object);
    expect(response.headers['set-cookie'][0].includes('sessionId')).toBe(true);
    expect(response.body).toHaveProperty('userId', 2);
  });
});

describe('Auth and logout tests', () => {
  // login should fail for users that are not registered
  it('should auth, validate the cookie and return the userId', async () => {
    const authResponse = await request(app).get('/auth').set('Cookie', authCookie);
    expect(authResponse.status).toBe(200);
    expect(authResponse.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(authResponse.body).toBeInstanceOf(Object);
    expect(authResponse.body).toHaveProperty('userId', 1);
  });

  it('should logout, clear the cookie and return a message', async () => {
    const logoutResponse = await request(app).get('/logout').set('Cookie', authCookie);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.headers['set-cookie'][0]).toEqual(expect.stringContaining('sessionId=;'));
    expect(logoutResponse.body).toHaveProperty('message', 'Logged out');
  });
});

describe('Symptoms CRUD', () => {
  // NB: need to login before saving a new symptom
  it('should save a new symptom', async () => {
    const saveResponse = await request(app)
      .post('/symptoms')
      .set('Cookie', authCookie)
      .send({ userId: 1, stool_type: 'Type 1', is_bleeding: true, other_symptoms: '' });
    expect(saveResponse.status).toBe(201);
  });

  it('should get all symptoms for a user', async () => {
    const response = await request(app).get(`/symptoms/${userId}`).set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should delete a new symptom', async () => {
    //create a new symptom
    const newSymptomResponse = await request(app)
      .post('/symptoms')
      .set('Cookie', authCookie)
      .send({ userId: 1, stool_type: 'Type 1', is_bleeding: true, other_symptoms: '' });

    const newSymptomId = newSymptomResponse.body.id;

    const deleteResponse = await request(app).delete(`/symptoms/${newSymptomId}`).set('Cookie', authCookie);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Deleted successfully');
  });

  it('should update a symptom', async () => {
    //create a new symptom
    const newSymptomResponse = await request(app)
      .post('/symptoms')
      .set('Cookie', authCookie)
      .send({ userId: 1, stool_type: 'Type 1', is_bleeding: true, other_symptoms: '' });

    const newSymptomId = newSymptomResponse.body.id;

    const updateResponse = await request(app)
      .patch(`/symptoms/${newSymptomId}`)
      .set('Cookie', authCookie)
      .send({ userId: 1, stool_type: 'Type 3', is_bleeding: false, other_symptoms: 'Headache' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('message', 'Updated successfully');
  });
});

//TODO describe items CRUD
// describe('Items CRUD', () => {
//   it('should save a new item', async () => {});
//   it('should get all items for a user', async () => {});
//   it('should delete an item', async () => {});
//   it('should update an item', async () => {});
// });

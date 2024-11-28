import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

describe('Application (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    accessToken = loginResponse.text;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / (AppController)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('AuthController', () => {
    it('POST /auth/register - success', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser1@example.com', password: 'password123' })
        .expect(201);
    });

    it('POST /auth/register - validation error', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email', password: '' })
        .expect(400);
    });

    it('POST /auth/login - success', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(201)
        .then((response) => {
          expect(response).toHaveProperty('text');
        });
    });

    it('POST /auth/login - invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('TodosController', () => {
    it('POST /todos - success', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Todo' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toEqual('Test Todo');
        });
    });

    it('POST /todos - validation error', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it('GET /todos - success', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('GET /todos - unauthorized', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(401);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { getTestsApp } from './test-utils';
import request from 'supertest';

describe('App', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await getTestsApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('sa/users', () => {
    it('ee', async () => {
      const user1 = await request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          login: 'tolya',
          password: 'tolya123',
          email: 'tolya@gmail.com',
        });
      expect(user1).toBeDefined();
      expect(user1.status).toBe(201);

      const user2 = await request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          login: 'kolya',
          password: 'kolya123',
          email: 'kolya@gmail.com',
        });
      expect(user1).toBeDefined();
      expect(user1.status).toBe(201);
    });
  });
});

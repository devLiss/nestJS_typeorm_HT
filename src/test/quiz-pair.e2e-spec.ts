import { INestApplication } from '@nestjs/common';
import { getAppAndCleanDB } from './utils/test-utils';
import request from 'supertest';

describe('Quiz-pairs', () => {
  const second = 1000;
  const minute = 60 * second;

  const superUser = { login: 'admin', password: 'qwerty' };
  jest.setTimeout(5 * minute);

  let app: INestApplication;
  beforeAll(async () => {
    app = await getAppAndCleanDB();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('game', () => {
    it('Create, connect games, add answers  POST -> "/pair-game-quiz/pairs/my-current/answers"', async () => {
      const user1 = await request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
          login: 'tolya',
          password: 'tata123',
          email: 'kolya@gmail.com',
        });
      console.log(user1);
      expect(user1).toBeDefined();
      expect(user1.status).toBe(201);
    });
  });
});

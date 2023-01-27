import { INestApplication } from '@nestjs/common';
import { getAppAndCleanDB } from '../src/test/utils/test-utils';

describe('Quiz-pairs', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await getAppAndCleanDB();
    await app.init();
    console.log('app start');
  });

  describe('game', () => {
    it(
      'Create, connect games, add answers  POST -> "/pair-game-quiz/pairs/my-current/answers", GET -> "/pair-game-quiz/pairs", GET -> "/pair-game-quiz/pairs/my-current": add answers to third game, created by user2, connected by user1: \n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'add incorrect answer by firstPlayer;\n' +
        'add correct answer by firstPlayer;\n' +
        'add correct answer by secondPlayer;\n' +
        'firstPlayer should win with 5 scores;\n' +
        'get active game and call "/pair-game-quiz/pairs/my-current by both users after each answer"\n' +
        '; status 200;',
      async () => {},
    );
  });
});

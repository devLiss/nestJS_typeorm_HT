import { QuizGameService } from './quiz-game.service';

export default function (req, res) {
  const service = new QuizGameService();
  service.finishGames()
    res.status(200).end('Finish Game Cron!');
}

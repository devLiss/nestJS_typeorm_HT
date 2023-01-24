import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';

export class SendAnswerCommand {
  constructor(public answer: string, public userId: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(command: SendAnswerCommand): Promise<any> {
    const currentGame = await this.repo.getCurrentGame(command.userId);
    console.log(currentGame.questions.length);

    const currentUserProgress = await this.repo.getProgressForCurrentGame(
      command.userId,
      currentGame.id,
    );

    if (currentGame.questions.length != currentUserProgress) {
      const check = await this.repo.getCurrentQuestion(
        currentGame.id,
        currentUserProgress,
      );
      const correctAnswers = await this.repo.getCorrectAnswers(
        check.questionsId,
      );
      let answerStatus = 'Incorrect';
      if (correctAnswers.correctAnswers.includes(command.answer)) {
        answerStatus = 'Correct';
      }
      const updatedProgress = await this.repo.updateProgress(
        command.userId,
        currentGame.id,
        check.questionsId,
        answerStatus,
      );

      return {
        questionId: updatedProgress.questionId,
        answerStatus: updatedProgress.answerStatus,
        addedAt: updatedProgress.addedAt,
      };
    }
  }
}

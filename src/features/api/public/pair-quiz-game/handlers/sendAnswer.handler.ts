import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PairQuizGameRepository } from '../pair-quiz-game.repository';
import { ForbiddenException } from '@nestjs/common';

export class SendAnswerCommand {
  constructor(public answer: string, public userId: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(private repo: PairQuizGameRepository) {}

  async execute(command: SendAnswerCommand): Promise<any> {
    const currentGame = await this.repo.getCurrentGame(command.userId);
    console.log('current Game ===> ', currentGame);
    if (!currentGame) throw new ForbiddenException();

    const currentUserProgress = await this.repo.getProgressForCurrentGame(
      command.userId,
      currentGame.id,
    );
    console.log('Current user progress ==> ', currentUserProgress);
    if (
      currentGame.questions &&
      currentGame.questions.length > currentUserProgress
    ) {
      const check = await this.repo.getCurrentQuestion(
        currentGame.id,
        currentUserProgress,
      );
      console.log(check);
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
    } else {
      throw new ForbiddenException();
    }
  }
}

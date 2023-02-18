import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class QuizGameService {
    @Cron('10 * * * * *')
    async finishGames(){

    }
}

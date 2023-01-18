import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SessionsSqlRepository } from '../../../../entities/postgres/sessionsSql.repository';

@Injectable()
export class SessionsService {
  constructor(
    protected sessionDbRepo: SessionsSqlRepository /*SessionRepository*/,
  ) {}

  async removeSessionByDeviceId(userId: string, devId: string) {
    return await this.sessionDbRepo.removeSessionByDeviceId(userId, devId);
  }

  async removeSessionsByUserId(userId: string, deviceId: string) {
    return await this.sessionDbRepo.removeSessionsWithoutCurrent(
      userId,
      deviceId,
    );
  }
  async removeUserSessions(userId: string) {
    return await this.sessionDbRepo.removeAllSessionsByUserId(userId);
  }

  async getSessionsByUserId(userId: string) {
    const session = await this.sessionDbRepo.getSessionsByUserId(userId);
    return session;
  }
  async getSessionByDeviceId(deviceId: string) {
    return await this.sessionDbRepo.getSessionByDeviceId(deviceId);
  }
}

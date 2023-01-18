import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor() {}
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async generatePasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(12);
    const passwordHash = await this._generateHash(password, passwordSalt);

    return {
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
    };
  }
}

import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
export class ConfirmCodeValidator {
  /*constructor(private userQueryRepo: UserQueryRepository) {}

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Code is incorrect or expired';
  }

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.userQueryRepo.getUserByCode(value);
    if (!user) {
      console.log("user doens't exist");
      return false;
    }

    console.log(user);
    const expiredDate = new Date(user.emailConfirmation.expiredDate);
    const isConfirmed = user.emailConfirmation.isConfirmed;
    if (isConfirmed) {
      console.log('Throw exception');
      return false;
    }
    return true;
  }*/
}

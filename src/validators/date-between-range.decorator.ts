import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDateBetweenRange', async: false })
class IsDateBetweenRange implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments) {
    if (!Array.isArray(value)) return false;

    const object: any = args.object;
    const startDate = new Date(object.start_date);
    const endDate = new Date(object.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;

    return value.every((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && date >= startDate && date <= endDate;
    });
  }

  defaultMessage() {
    return `Each projected_exercise_date must be a valid date between start_date and end_date.`;
  }
}

export function IsDateBetweenRangeDecorator(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsDateBetweenRangeDecorator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsDateBetweenRange,
    });
  };
}

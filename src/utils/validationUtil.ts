import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose'; // Import Mongoose

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Types.ObjectId.isValid(value); // Validate using Mongoose
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid ObjectId format';
        },
      },
    });
  };
}

import { validateSync } from "class-validator";
import { IValidatorFields } from "./validator-fields-interface";
import { Notification } from "./notification";

// export abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {
//   errors: FieldsErrors = null;
//   validatedData: PropsValidated = null;
//   validate(data: any): boolean {
//     const errors = validateSync(data);
//     if (errors.length) {
//       this.errors = {};
//       for (const error of errors) {
//         const field = error.property;
//         this.errors[field] = Object.values(error.constraints);
//       }
//     } else {
//       this.validatedData = data
//     }
//     return !errors.length;
//     //!0=truth
//     //!2=falsy
//   }
// }
// export default ClassValidatorFields;
export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const errors = validateSync(data, {
      groups: fields,
    });
    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints!).forEach((message) => {
          notification.addError(message, field);
        });
      }
    }
    return !errors.length;
  }
}
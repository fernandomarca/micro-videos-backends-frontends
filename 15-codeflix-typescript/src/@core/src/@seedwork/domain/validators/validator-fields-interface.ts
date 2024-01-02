import { Notification } from "#seedwork/domain/validators/notification";

export type FieldsErrors = {
  [field: string]: string[]
}

// export interface ValidatorFieldsInterface<PropsValidated> {
//   errors: FieldsErrors;
//   validatedData: PropsValidated;
//   validate(data: any): boolean;
// }

export interface IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean;
}
import { FieldValue, FieldValues } from 'react-hook-form';

export interface IFormField<T extends FieldValues> {
  name: FieldValue<T>;
  label: string;
  isDisabled?: boolean;
  type?: string;
  placeholder?: string;
}

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

import { IFormField } from '../../interfaces/form-fields.interface';

interface IInput<T extends FieldValues> extends IFormField<T> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const Input = <T extends FieldValues>({
  errors,
  name,
  label,
  register,
  isDisabled = true,
  type = 'text',
  placeholder = '••••••••',
}: IInput<T>) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm text-gray-800 dark:text-white-powder"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border border-gray-300 text-gray-800 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-black-rich-tint dark:border-gray-600 dark:placeholder-gray-400 dark:text-white-powder dark:focus:ring-blue-cerulean dark:focus:border-blue-cerulean ${
          errors[name]?.message
            ? 'focus:ring-rose-800 focus:border-rose-800'
            : 'focus:ring-blue-cerulean focus:border-blue-cerulean'
        }`}
        disabled={!isDisabled}
        placeholder={placeholder}
        {...register(name)}
      />
      {errors[name] && (
        <p role="alert" className="text-xs text-rose-800 mt-2">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default Input;

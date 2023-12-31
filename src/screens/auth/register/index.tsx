import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../../components/form/Input';
import SubmitButton from '../../../components/form/SubmitButton';
import { IFormField } from '../../../interfaces/form-fields.interface';
import {
  RegisterValidationSchema,
  registerValidationSchema,
} from '../../../schemas/auth.schema';
import { useRegisterMutation } from '../../../store/features/api.slice';
import Container from '../../../components/ui/Container';

const registerFields: IFormField<FieldValues>[] = [
  {
    label: 'Username: ',
    name: 'username',
  },
  {
    label: 'E-mail: ',
    name: 'email',
  },
  {
    label: 'Password: ',
    name: 'password',
    type: 'password',
  },
];

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterValidationSchema>({
    resolver: zodResolver(registerValidationSchema),
  });
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const onSubmit = async (data: RegisterValidationSchema) => {
    const result = await registerUser(data);

    if (!('error' in result)) {
      reset();
      return navigate('/', { replace: true });
    }
  };

  return (
    <Container containerClass="w-[344px] md:w-[422px]" tabTitle="Register">
      <div className="md:w-[422px] bg-white-powder rounded-lg shadow-sm text-left mb-8 xl:mb-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-800 md:text-2xl  flex items-center justify-center gap-2">
            Create new account
          </h1>
          <form
            className="space-y-4 md:space-y-6 text-rusty-red"
            onSubmit={handleSubmit(onSubmit)}
          >
            {registerFields.map((el) => (
              <Input
                key={el.name}
                name={el.name}
                label={el.label}
                type={el.type}
                register={register}
                errors={errors}
              />
            ))}

            <SubmitButton isLoading={isLoading} error={error} label="Sign in" />

            <div className="flex justify-between items-center gap-2 md:gap-0">
              <p className="text-sm font-light text-gray-600 ">
                Have an account?{' '}
                <Link
                  to="/auth"
                  className="font-medium text-blue-cerulean hover:underline underline"
                >
                  Sign in.
                </Link>
              </p>

              <p className="text-sm font-light">
                <Link
                  to="/auth/password-reset"
                  className="font-medium text-blue-cerulean"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Register;

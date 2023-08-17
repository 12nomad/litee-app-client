import { Helmet } from 'react-helmet-async';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { useCookies } from 'react-cookie';

import Input from '../../../components/form/Input';
import SubmitButton from '../../../components/form/SubmitButton';
import { IFormField } from '../../../interfaces/form-fields.interface';
import {
  LogInValidationSchema,
  logInValidationSchema,
} from '../../../schemas/auth.schema';
import {
  CommonOutput,
  useLoginMutation,
} from '../../../store/features/api.slice';

const loginFields: IFormField<FieldValues>[] = [
  {
    label: 'Username or e-mail: ',
    name: 'usernameOrEmail',
  },
  {
    label: 'Password: ',
    name: 'password',
    type: 'password',
  },
];

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LogInValidationSchema>({
    resolver: zodResolver(logInValidationSchema),
  });
  const [, setCookie] = useCookies(['__litee_app_access_token']);
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async ({
    usernameOrEmail,
    password,
  }: LogInValidationSchema) => {
    const isEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

    let result:
      | {
          data: CommonOutput;
        }
      | {
          error: FetchBaseQueryError | SerializedError;
        };
    if (isEmail.test(usernameOrEmail))
      result = await login({ email: usernameOrEmail, password });
    else result = await login({ username: usernameOrEmail, password });

    if (!('error' in result)) {
      reset();
      setCookie('__litee_app_access_token', result.data.token, {
        secure: true,
        sameSite: 'none',
        domain: '.railway.app',
      });
      return navigate('/', { replace: true });
    }
  };

  return (
    <section className="w-[344px] md:w-[422px]">
      <Helmet>
        <title>Login | Litee.</title>
      </Helmet>

      <div className="md:w-[422px] bg-white-powder rounded-lg shadow-sm text-left mb-8 xl:mb-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-800 md:text-2xl  flex items-center justify-center gap-2">
            Welcome back
          </h1>
          <form
            className="space-y-4 md:space-y-6 text-rusty-red"
            onSubmit={handleSubmit(onSubmit)}
          >
            {loginFields.map((el) => (
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
                No account yet?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-blue-cerulean hover:underline underline"
                >
                  Sign up.
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
    </section>
  );
};

export default Login;

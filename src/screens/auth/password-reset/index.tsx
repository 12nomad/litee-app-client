import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Step from './components/Step';
import PasswordUpdate from './components/UpdatePassword';
import VerifyReset from './components/VerifyReset';
import Input from '../../../components/form/Input';
import SubmitButton from '../../../components/form/SubmitButton';
import { usePasswordResetMutation } from '../../../store/features/api.slice';
import {
  ResetPasswordStepOneValidationSchema,
  resetPasswordStepOneValidationSchema,
} from '../../../schemas/auth.schema';

export type Steps = '1' | '2' | '3';

const PasswordReset = () => {
  const [step, setStep] = useState<Steps>('1');
  const [verificationEmail, setVerificationEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordStepOneValidationSchema>({
    resolver: zodResolver(resetPasswordStepOneValidationSchema),
  });

  const [passwordReset, { isLoading, error }] = usePasswordResetMutation();

  const onSubmit = async ({ email }: ResetPasswordStepOneValidationSchema) => {
    setVerificationEmail(email);

    const result = await passwordReset({ email });

    if (!('error' in result)) {
      reset();
      setStep('2');
    }
  };

  return (
    <section className="w-[344px] md:w-auto">
      <Helmet>
        <title>Reset Password | Litee Snack🍔</title>
      </Helmet>

      <Step step={step} />

      <div className="bg-white rounded-lg shadow-sm text-left mx-8 md:mx-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div>
            <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl  flex items-center justify-center gap-2">
              Reset Password.
            </h1>
            {step === '2' && (
              <p className=" text-center underline">
                A verification code has been sent to your e-mail
              </p>
            )}
          </div>

          {step === '2' ? (
            <VerifyReset email={verificationEmail} setStep={setStep} />
          ) : step === '3' ? (
            <PasswordUpdate
              email={verificationEmail}
              setStep={setStep}
              setVerificationEmail={setVerificationEmail}
            />
          ) : (
            <form
              className="space-y-4 md:space-y-6 text-rusty-red"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                name="email"
                label="E-mail: "
                register={register}
                errors={errors}
              />

              <SubmitButton
                error={error}
                isLoading={isLoading}
                label="Confirm"
              />

              <div className="flex justify-between items-center ">
                <p className="text-sm font-light text-gray-500 ">
                  Return to{' '}
                  <Link
                    to="/auth"
                    className="font-medium text-sky-700 hover:underline underline"
                  >
                    Login.
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default PasswordReset;

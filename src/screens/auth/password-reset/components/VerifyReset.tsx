import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Steps } from '..';
import useVerifyReset from '../hooks/useVerifyReset';
import SubmitButton from '../../../../components/form/SubmitButton';
import Input from '../../../../components/form/Input';
import {
  ResetPasswordStepTwoValidationSchema,
  resetPasswordStepTwoValidationSchema,
} from '../../../../schemas/auth.schema';

interface IVerifyReset {
  setStep: Dispatch<SetStateAction<Steps>>;
  email: string;
}

const VerifyReset = ({ setStep, email }: IVerifyReset) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordStepTwoValidationSchema>({
    resolver: zodResolver(resetPasswordStepTwoValidationSchema),
  });

  const [verifyReset, { isLoading, error }] = useVerifyReset();

  const onSubmit = async ({ code }: ResetPasswordStepTwoValidationSchema) => {
    const result = await verifyReset({ email, reset: code });

    if (!('error' in result)) {
      reset();
      setStep('3');
    }
  };

  return (
    <form
      className="space-y-4 md:space-y-6 text-rusty-red"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Verification Code: "
        name="code"
        errors={errors}
        register={register}
      />

      <SubmitButton isLoading={isLoading} error={error} label="Verify" />

      <div className="flex justify-between items-center ">
        <p className="text-sm font-light text-gray-500 ">
          Return to{' '}
          <Link
            to="/auth"
            className="font-medium text-sky-700 hover:underline underline"
          >
            Sign in.
          </Link>
        </p>
      </div>
    </form>
  );
};

export default VerifyReset;

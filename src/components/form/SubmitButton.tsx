import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import Spinner from '../ui/Spinner';
import ErrorHandler from '../ui/ErrorHandler';

interface ISubmitButton {
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  label: string;
}

const SubmitButton = ({ error, isLoading, label }: ISubmitButton) => {
  return (
    <div>
      <button
        type="submit"
        className="w-full text-white-powder bg-purple-eminence hover:bg-purple-eminence-shade focus:ring-1 focus:outline-none focus:ring-purple-eminence-tint font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : label}
      </button>
      {error && <ErrorHandler error={error} />}
    </div>
  );
};

export default SubmitButton;

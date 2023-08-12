import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';

import getApiError from '../../utils/getApiError.util';
import { Navigate } from 'react-router-dom';

interface IError {
  error: FetchBaseQueryError | SerializedError | undefined;
}

const ErrorHandler = ({ error }: IError) => {
  const errorString = getApiError(error);

  if (errorString && errorString.toLowerCase() === 'unauthorized')
    return <Navigate to="/auth" replace={true} />;

  return (
    <p role="alert" className="text-xs text-rose-700 mt-2 font-bold ">
      <sup>*</sup> {errorString}
    </p>
  );
};

export default ErrorHandler;

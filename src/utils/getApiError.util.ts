import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const isFetchBaseQueryError = (
  error: FetchBaseQueryError | SerializedError | undefined,
): error is FetchBaseQueryError => {
  return (
    Boolean((error as FetchBaseQueryError).status) &&
    Boolean((error as FetchBaseQueryError).data)
  );
};

const getApiError = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string | undefined => {
  if (error) {
    if (isFetchBaseQueryError(error)) {
      const data = error.data as {
        error?: string;
        message?: string;
        statusCode?: number;
      };
      return data.message;
    } else {
      return error.message;
    }
  }

  return undefined;
};

export default getApiError;

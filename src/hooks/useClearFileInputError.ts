import { useEffect } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

const useClearFileInputError = (
  fileError: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
  clearFn: () => void,
  errorDuration: number,
) => {
  useEffect(() => {
    let clear: NodeJS.Timeout;
    if (fileError && fileError.message) {
      clear = setTimeout(() => clearFn(), errorDuration);
    }

    return () => {
      clearTimeout(clear);
    };
  }, [fileError]);
};

export default useClearFileInputError;

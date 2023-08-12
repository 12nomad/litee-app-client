import { useEffect } from 'react';

import { useVerifyResetMutation } from '../../../../store/features/api.slice';

const useVerifyReset = () => {
  useEffect(() => {
    window.onbeforeunload = () => {
      return 'If you leave the page, the verification code will be reset. Are you sure?';
    };
  }, []);

  return useVerifyResetMutation();
};

export default useVerifyReset;

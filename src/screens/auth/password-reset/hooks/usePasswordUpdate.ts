import { useEffect } from 'react';

import { useUpdatePasswordMutation } from '../../../../store/features/api.slice';

const usePasswordUpdate = () => {
  useEffect(() => {
    window.onbeforeunload = () => {
      return 'If you leave the page, the verification code will be reset. Are you sure?';
    };
  }, []);

  return useUpdatePasswordMutation();
};

export default usePasswordUpdate;

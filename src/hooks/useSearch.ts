import { useEffect } from 'react';

import useDebounce from './useDebounce';
import { useLazySearchUserByUsernameQuery } from '../store/features/api.slice';

const useSearch = (username: string) => {
  const [getUsers, { isLoading, error, data }] =
    useLazySearchUserByUsernameQuery();
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (username) getUsers({ username: debouncedUsername });
  }, [debouncedUsername]);

  return { isLoading, error, data };
};

export default useSearch;

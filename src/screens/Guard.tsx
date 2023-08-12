import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Loading from '../components/ui/Loading';
import { socket, useGetAuthUserQuery } from '../store/features/api.slice';
import { useAppDispatch } from '../store/store';
import { addUser } from '../store/features/user.slice';
import { EVENTS } from '../data/event.constant';

const Guard = () => {
  const location = useLocation();
  const { data, isLoading, error } = useGetAuthUserQuery({
    pathname: location.pathname,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(addUser({ user: data }));
      socket.connect();
      socket.emit<`${EVENTS}`>('CONNECT', { username: data.username });
    } else if (!isLoading && !data) {
      return navigate('/auth', { replace: true });
    }
  }, [isLoading, data]);

  if (isLoading) return <Loading withNav={false} />;

  if (error) return <Navigate to="/auth" replace />;

  return !isLoading && data ? <Outlet /> : null;
};

export default Guard;

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Loading from "../components/ui/Loading";
import { socket, useGetAuthUserQuery } from "../store/features/api.slice";
import { useAppDispatch } from "../store/store";
import { addUser } from "../store/features/user.slice";
import { EVENTS } from "../data/event.constant";

const Guard = () => {
  const { isLoading, currentData, error, isError } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && currentData) {
      dispatch(addUser({ user: currentData }));
      localStorage.setItem("lt-app-key", currentData.username);
      socket.connect();
      socket.emit<`${EVENTS}`>("CONNECT", { username: currentData.username });
    } else if (!isLoading && isError) {
      return navigate("/auth", { replace: true });
    }
  }, [isLoading]);

  if (isLoading) return <Loading withNav={false} />;

  if (error) return <Navigate to="/auth" replace />;

  return !isLoading && currentData ? <Outlet /> : null;
};

export default Guard;

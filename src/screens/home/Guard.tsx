import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { socket, useGetAuthUserQuery } from "../../store/features/api.slice";
import { useAppDispatch } from "../../store/store";
import { addUser } from "../../store/features/user.slice";
import { EVENTS } from "../../data/event.constant";
import Loading from "../../components/ui/Loading";

const Guard = () => {
  const { isLoading, data, error, refetch } = useGetAuthUserQuery();
  const [errorCount, setErrorCount] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(addUser({ user: data }));
      sessionStorage.setItem("lt-app-key", data.username);
      socket.connect();
      socket.emit<`${EVENTS}`>("CONNECT", { username: data.username });
    } else if (!isLoading && error) {
      if (errorCount === 0) {
        setErrorCount((prev) => ++prev);
        refetch();
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [error, data]);

  if (isLoading) return <Loading withNav={false} />;

  return !isLoading && !error && data ? <Outlet /> : null;
};

export default Guard;

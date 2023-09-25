import { Route, Routes } from "react-router-dom";

import Auth from "./screens/auth";
import Login from "./screens/auth/login/Login";
import Guard from "./screens/Guard";
import Home from "./screens/home";
import Register from "./screens/auth/register/Register";
import PasswordReset from "./screens/auth/password-reset";
import NotFound from "./screens/common/not-found/NotFound";

const App = () => {
  return (
    <Routes>
      <Route element={<Guard />}>
        <Route path="/*" element={<Home />} />
      </Route>
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="password-reset" element={<PasswordReset />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;

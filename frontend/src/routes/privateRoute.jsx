import { Navigate } from "react-router-dom";
import { checkTokenExpired, logout } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  if (checkTokenExpired()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

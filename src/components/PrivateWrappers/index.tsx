import { Navigate, Outlet } from "react-router-dom";
import { useValidateToken } from "../../hooks/useValidateToken";

const PrivateRoutes = () => {
  const { isSuccess, isLoading, isError } = useValidateToken();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (isError) {
    return <Navigate to="/" replace />;
  }

  return isSuccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;

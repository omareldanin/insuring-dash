import { Outlet } from "react-router-dom";
import { useValidateToken } from "../../hooks/useValidateToken";
import Login from "../../pages/Login";

const PrivateRoutes = () => {
  const { isSuccess, isLoading, isError } = useValidateToken();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (isError) {
    return <Login />;
  }

  return isSuccess ? <Outlet /> : <Login />;
};

export default PrivateRoutes;

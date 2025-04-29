import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUserState } from '../../services/slices/user-Info-slice/user-info';
import type ProtectedRouteProps from './type';

export const ProtectedRoute = ({
  children,
  onlyAuthorized
}: ProtectedRouteProps) => {
  const location = useLocation();

  const { isAuthenticated } = useSelector(selectUserState);

  if (!onlyAuthorized && !isAuthenticated)
    return <Navigate replace to='/login' state={{ from: location }} />;

  if (onlyAuthorized && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children ? children : <Outlet />;
};

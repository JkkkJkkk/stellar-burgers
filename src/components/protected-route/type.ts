import { ReactNode } from 'react';

export default interface ProtectedRouteProps {
  children?: ReactNode;
  onlyAuthorized?: boolean;
}

import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';

import { getLogoutUser } from '../../services/slices/user-Info-slice/user-info';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(getLogoutUser());
    navigate('/login', { replace: true });
  }, [dispatch, navigate]);

  return <ProfileMenuUI pathname={pathname} handleLogout={handleLogout} />;
};

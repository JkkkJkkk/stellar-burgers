import { FC, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { getFeeds } from '../../services/slices/feed-slice/feed';
import {
  getOrders,
  selectUserState
} from '../../services/slices/user-Info-slice/user-info';
import type { AppDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userOrders, request: isLoading } = useSelector(selectUserState);
  const [error, setError] = useState<string | null>(null);

  const loadOrdersData = useCallback(async () => {
    try {
      await Promise.all([dispatch(getOrders()), dispatch(getFeeds())]);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load orders data'
      );
    }
  }, [dispatch]);

  useEffect(() => {
    loadOrdersData();
  }, [loadOrdersData]);

  if (isLoading) return <Preloader />;
  if (error) return <div className='text-center p-4 text-error'>{error}</div>;

  return userOrders ? <ProfileOrdersUI orders={userOrders} /> : null;
};

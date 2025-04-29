import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { getFeeds, getFeedState } from '../../services/slices/feed-slice/feed';
import type { AppDispatch } from '../../services/store';

export const Feed: FC = () => {
  const { orders, isLoading } = useSelector(getFeedState);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleRefreshFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefreshFeeds} />;
};

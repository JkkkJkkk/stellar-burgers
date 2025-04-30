import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { getFeedState } from '../../services/slices/feed-slice/feed';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';

const getNumbersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .map((order) => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedState);

  const ready = useMemo(() => getNumbersByStatus(orders, 'done'), [orders]);
  const pending = useMemo(
    () => getNumbersByStatus(orders, 'pending'),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={ready}
      pendingOrders={pending}
      feed={{ orders, total, totalToday }}
    />
  );
};

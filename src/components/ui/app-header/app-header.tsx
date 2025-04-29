import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName = 'Личный кабинет'
}) => {
  const { pathname } = useLocation();

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return `${styles.link} ${isActive ? styles.link_active : ''}`;
  };

  const getIconType = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive ? 'primary' : 'secondary';
  };

  const navItems = [
    {
      path: '/',
      exact: true,
      icon: BurgerIcon,
      text: 'Конструктор',
      className: ''
    },
    {
      path: '/feed',
      exact: false,
      icon: ListIcon,
      text: 'Лента заказов',
      className: ''
    },
    {
      path: '/profile',
      exact: false,
      icon: ProfileIcon,
      text: userName,
      className: styles.link_position_last
    }
  ];

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${getLinkClass(item.path, item.exact)} ${item.className}`}
            >
              <item.icon type={getIconType(item.path, item.exact)} />
              <p className='text text_type_main-default ml-2 mr-10'>
                {item.text}
              </p>
            </Link>
          ))}
        </div>

        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        <Link
          to={navItems[2].path}
          className={`${getLinkClass(navItems[2].path, navItems[2].exact)} ${navItems[2].className}`}
        >
          <ProfileIcon
            type={getIconType(navItems[2].path, navItems[2].exact)}
          />
          <p className='text text_type_main-default ml-2'>{navItems[2].text}</p>
        </Link>
      </nav>
    </header>
  );
};

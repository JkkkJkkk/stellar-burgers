import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { ProtectedRoute } from '../protected-route/protected-route';
import styles from './app.module.css';
import { getIngredients } from '../../services/slices/ingredients-slice/ingredients';

const MODAL_TITLES = {
  INGREDIENT: 'Детали ингредиента',
  ORDER: 'Детали заказа',
  PROFILE_ORDER: 'Информация о заказе'
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backgroundLocation = location.state?.background;

  const handleModalClose = () => navigate(-1);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const commonRoutes = (
    <>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='*' element={<NotFound404 />} />
    </>
  );

  const authRoutes = (
    <>
      <Route
        path='/login'
        element={
          <ProtectedRoute onlyAuthorized>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute onlyAuthorized>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute onlyAuthorized>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute onlyAuthorized>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
    </>
  );

  const profileRoutes = (
    <>
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
    </>
  );

  const detailRoutes = (
    <>
      <Route path='/ingredients/:id' element={<IngredientDetails />} />
      <Route path='/feed/:number' element={<OrderInfo />} />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        }
      />
    </>
  );

  const modalRoutes = (
    <>
      <Route
        path='/ingredients/:id'
        element={
          <Modal title={MODAL_TITLES.INGREDIENT} onClose={handleModalClose}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/feed/:number'
        element={
          <Modal title={MODAL_TITLES.ORDER} onClose={handleModalClose}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <Modal
              title={MODAL_TITLES.PROFILE_ORDER}
              onClose={handleModalClose}
            >
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
    </>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        {commonRoutes}
        {authRoutes}
        {profileRoutes}
        {detailRoutes}
      </Routes>

      {backgroundLocation && <Routes>{modalRoutes}</Routes>}
    </div>
  );
};

export default App;

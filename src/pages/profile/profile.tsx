import { FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  getUser,
  selectUserState,
  updateUser
} from '../../services/slices/user-Info-slice/user-info';
import type { AppDispatch } from '../../services/store';

interface ProfileFormState {
  name: string;
  email: string;
  password: string;
}

export const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, request: loading } = useSelector(selectUserState);
  const [formValue, setFormValue] = useState<ProfileFormState>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const hasChanges =
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      formValue.password !== '';
    setIsFormChanged(hasChanges);
  }, [formValue, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
    setIsFormChanged(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormChanged || !formValue.name || !formValue.email) return;

    try {
      await dispatch(updateUser(formValue)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
      setIsFormChanged(false);
      dispatch(getUser());
    } catch {
      return;
    }
  };

  if (loading) return <Preloader />;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

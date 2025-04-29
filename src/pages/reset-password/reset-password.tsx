import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

interface ResetPasswordState {
  password: string;
  token: string;
}

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const atrResetPass: ResetPasswordState = {
        password,
        token
      };
      await resetPasswordApi(atrResetPass);
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword'))
      navigate('/forgot-password', { replace: true });
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};

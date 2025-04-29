import { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        setError('Email is required');
        return;
      }

      setError(undefined);
      setIsLoading(true);

      try {
        await forgotPasswordApi({ email });
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Password reset request failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate]
  );

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};

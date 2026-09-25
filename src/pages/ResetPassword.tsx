import { useState } from 'react';
import { TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/Button';
import { updatePassword } from '../api/auth';

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const email = sessionStorage.getItem('resetEmail');

  const handleResetPassword = async () => {
    setError('');

    if (!email) {
      setError('Reset session expired. Please start again.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);

      const updated = await updatePassword(email, password);

      if (!updated) {
        setError('Unable to update password. User not found.');
        return;
      }

      sessionStorage.removeItem('resetEmail');

      navigate('/login');
    } catch (error) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/check-email"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
      >
        &lt; Back
      </Link>

      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
          PASSWORD RECOVERY
        </p>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Reset your password
        </h2>

        <p className="text-slate-500">
          Create a new password for your account.
        </p>

        {email && (
          <p className="text-sm text-slate-500 mt-2">
            Resetting password for{' '}
            <span className="font-semibold text-slate-700">
              {email}
            </span>
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New password
          </label>

          <TextField
            fullWidth
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoComplete="new-password"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
              },
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm new password
          </label>

          <TextField
            fullWidth
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            autoComplete="new-password"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                '& fieldset': {
                  borderColor: '#E2E8F0',
                },
              },
            }}
          />
        </div>

        <p className="text-xs text-slate-500">
          Password must contain at least 8 characters.
        </p>

        <PrimaryButton
          className="mt-2"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? 'Updating password...' : 'Reset password'}
        </PrimaryButton>
      </div>

      <div className="text-center text-sm text-slate-500 mt-4 border-t border-slate-100 pt-6">
        Remembered your password?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
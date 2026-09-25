import { useState } from 'react';
import { TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/Button';
import { getUserByEmail } from '../api/auth';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    const enteredEmail = email.trim();

    setError('');

    if (!enteredEmail) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const user = await getUserByEmail(enteredEmail);

      console.log('Entered email:', enteredEmail);
      console.log('User returned from API:', user);

      if (!user) {
        setError('No account found with this email address.');
        return;
      }

      sessionStorage.setItem('resetEmail', user.email);

      navigate('/check-email');
    } catch (error) {
      console.error('API ERROR:', error);

      setError(
        'Unable to connect to JSON Server. Make sure it is running on port 3001.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/login"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
      >
        &lt; Back to sign in
      </Link>

      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
          PASSWORD RECOVERY
        </p>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Forgot your password?
        </h2>

        <p className="text-slate-500">
          Enter your work email and we'll send you a link to reset it.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Work email
          </label>

          <TextField
            fullWidth
            type="email"
            placeholder="you@acmecorp.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError('');
            }}
            variant="outlined"
            autoComplete="email"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',

                '& fieldset': {
                  borderColor: '#E2E8F0',
                },

                '&:hover fieldset': {
                  borderColor: '#CBD5E1',
                },

                '&.Mui-focused fieldset': {
                  borderColor: '#2563EB',
                },
              },
            }}
          />
        </div>

        <PrimaryButton
          className="mt-2"
          onClick={handleSendResetLink}
          disabled={loading}
        >
          {loading ? 'Checking email...' : 'Send reset link'}
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
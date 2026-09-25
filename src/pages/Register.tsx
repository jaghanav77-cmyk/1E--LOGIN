import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

import { PrimaryButton } from '../components/ui/Button';
import { createUser } from '../api/auth';

export const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Full name is required.');
      return;
    }

    if (!trimmedEmail) {
      setError('Work email is required.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters.'
      );
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
      setLoading(true);

      const user = await createUser(
        trimmedName,
        trimmedEmail,
        password
      );

      sessionStorage.setItem(
        'authEmail',
        user.email
      );

      sessionStorage.setItem(
        'registrationOtp',
        user.otp
      );

      navigate(
        `/login?email=${encodeURIComponent(
          user.email
        )}`
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          'Unable to create account. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
          STEP 1 OF 2 · REGISTRATION
        </p>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Create your account
        </h2>

        <p className="text-slate-500">
          Enter your details to create your Stackly
          account.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 text-red-700 text-sm">
          <AlertCircle
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <div>
            <p className="font-semibold">
              Registration failed
            </p>

            <p className="text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Full Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          placeholder="Enter your full name"
          disabled={loading}
          className="w-full h-14 px-4 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Work Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
          }}
          placeholder="you@acmecorp.com"
          disabled={loading}
          className="w-full h-14 px-4 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            placeholder="Create a password"
            disabled={loading}
            className="w-full h-14 px-4 pr-12 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(
                event.target.value
              );
              setError('');
            }}
            placeholder="Confirm your password"
            disabled={loading}
            className="w-full h-14 px-4 pr-12 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500 -mt-2">
        Password must contain at least 8 characters.
      </p>

      <PrimaryButton
        onClick={handleRegister}
        disabled={loading}
      >
        {loading
          ? 'Creating account...'
          : 'Create account →'}
      </PrimaryButton>

      <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
        Already have an account?{' '}

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Sign in
        </button>
      </div>

    </div>
  );
};
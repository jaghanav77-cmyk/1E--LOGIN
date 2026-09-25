import { useState } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

import { PrimaryButton } from '../components/ui/Button';
import { verifyPassword } from '../api/auth';

export const EnterPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email =
    searchParams.get('email') ||
    sessionStorage.getItem('authEmail') ||
    '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberDevice, setRememberDevice] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(0);

  const maxAttempts = 5;

  const getInitials = (emailAddress: string) => {
    if (!emailAddress) {
      return 'U';
    }

    return emailAddress
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const getCompanyName = (emailAddress: string) => {
    if (!emailAddress.includes('@')) {
      return 'your organization';
    }

    const domain = emailAddress.split('@')[1];

    if (!domain) {
      return 'your organization';
    }

    return domain
      .split('.')[0]
      .replace(/^./, (letter) => letter.toUpperCase());
  };

  const handleSignIn = async () => {
    if (!email) {
      setError(
        'Email address is missing. Please enter your email again.'
      );
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (attempts >= maxAttempts) {
      navigate('/locked');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const isValid = await verifyPassword(
        email,
        password
      );

      if (isValid) {
        sessionStorage.setItem(
          'authEmail',
          email
        );

        if (rememberDevice) {
          localStorage.setItem(
            'rememberDevice',
            'true'
          );
        } else {
          localStorage.removeItem(
            'rememberDevice'
          );
        }

        navigate('/2fa');

        return;
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        navigate('/locked');
        return;
      }

      setError(
        `Incorrect password. ${maxAttempts - newAttempts} attempt${
          maxAttempts - newAttempts === 1
            ? ''
            : 's'
        } remaining.`
      );
    } catch (error) {
      setError(
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    sessionStorage.removeItem('authEmail');

    navigate('/register');
  };

  const initials = getInitials(email);
  const companyName = getCompanyName(email);

  return (
    <div className="flex flex-col gap-6">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 w-fit"
      >
        &lt; Back
      </button>

      {/* Heading */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
          STEP 2 OF 3 · PASSWORD
        </p>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Enter your password
        </h2>

        <p className="text-slate-500">
          Signing in to{' '}
          <span className="font-semibold text-slate-800">
            {companyName}.
          </span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 text-red-700 text-sm">
          <AlertCircle
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <div>
            <p className="font-semibold">
              Sign in failed
            </p>

            <p className="text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Account */}
      <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              {email || 'No email selected'}
            </p>

            <p className="text-sm text-slate-500">
              Not you? Use a different account
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleSwitchAccount}
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Switch
        </button>

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
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSignIn();
              }
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            className="w-full h-14 px-4 pr-12 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">

        <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">

          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(event) =>
              setRememberDevice(
                event.target.checked
              )
            }
            className="w-4 h-4 accent-indigo-600"
          />

          <span>
            Remember this device for 30 days
          </span>

        </label>

        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Forgot password?
        </Link>

      </div>

      {/* Sign In */}
      <PrimaryButton
        onClick={handleSignIn}
        disabled={loading || !email}
      >
        {loading
          ? 'Signing in...'
          : 'Sign in'}
      </PrimaryButton>

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 mt-4 border-t border-slate-100 pt-6">
        Protected by enterprise password policy ·{' '}
        {maxAttempts} attempts before lockout
      </div>

    </div>
  );
};
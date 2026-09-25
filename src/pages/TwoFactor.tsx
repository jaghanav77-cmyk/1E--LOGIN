import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { AlertCircle } from 'lucide-react';

import { PrimaryButton } from '../components/ui/Button';
import {
  getUserByEmail,
  verifyOtp,
} from '../api/auth';

export const TwoFactor = () => {
  const navigate = useNavigate();

  const email =
    sessionStorage.getItem('authEmail') || '';

  const [registrationOtp, setRegistrationOtp] =
    useState('');

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [error, setError] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(true);

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  /*
   * Get the OTP belonging to the
   * currently signed-in user.
   */
  useEffect(() => {
    const loadUserOtp = async () => {
      if (!email) {
        setOtpLoading(false);

        setError(
          'Authentication session expired. Please sign in again.'
        );

        return;
      }

      try {
        const user =
          await getUserByEmail(email);

        if (!user) {
          setError(
            'User account could not be found.'
          );

          return;
        }

        setRegistrationOtp(user.otp);
      } catch (error) {
        setError(
          'Unable to load the verification code.'
        );
      } finally {
        setOtpLoading(false);
      }
    };

    loadUserOtp();
  }, [email]);

  const handleChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    setError('');

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  const handleVerify =
    async () => {
      setError('');

      const enteredOtp =
        otp.join('');

      if (!email) {
        setError(
          'Authentication session expired. Please sign in again.'
        );

        return;
      }

      if (
        enteredOtp.length !== 6
      ) {
        setError(
          'Please enter the complete 6-digit verification code.'
        );

        return;
      }

      try {
        setLoading(true);

        const isValid =
          await verifyOtp(
            email,
            enteredOtp
          );

        if (!isValid) {
          setError(
            'Invalid verification code. Please try again.'
          );

          return;
        }

        sessionStorage.removeItem(
          'registrationOtp'
        );

        navigate('/success');
      } catch (error) {
        setError(
          'Unable to connect to the server. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex flex-col gap-6">

      <Link
        to="/login"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 w-fit"
      >
        &lt; Back
      </Link>

      <div>

        <p className="text-xs font-semibold tracking-wider text-slate-400 mb-2">
          STEP 3 OF 3 · VERIFY
        </p>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Two-factor verification
        </h2>

        <p className="text-slate-500">
          Enter the 6-digit code from
          your authenticator app.
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
              Verification failed
            </p>

            <p className="text-red-600">
              {error}
            </p>
          </div>

        </div>
      )}

      {!otpLoading &&
        registrationOtp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

            <p className="text-sm font-semibold text-blue-700 mb-1">
              Your verification code
            </p>

            <p className="text-sm text-blue-600 mb-2">
              Use this code to complete
              your sign in.
            </p>

            <p className="text-3xl font-bold tracking-[0.4em] text-blue-800">
              {registrationOtp}
            </p>

          </div>
        )}

      <div className="flex gap-2 justify-between my-4">

        {otp.map(
          (digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[
                  index
                ] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleChange(
                  index,
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleKeyDown(
                  index,
                  event
                )
              }
              className="w-12 h-14 text-center text-xl font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
            />
          )
        )}

      </div>

      <PrimaryButton
        onClick={handleVerify}
        disabled={
          loading ||
          otpLoading
        }
      >
        {loading
          ? 'Verifying...'
          : 'Verify and sign in'}
      </PrimaryButton>

      <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6">

        Having trouble?{' '}

        <button
          type="button"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Contact support
        </button>

      </div>

    </div>
  );
};
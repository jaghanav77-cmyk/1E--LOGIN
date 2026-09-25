import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../components/ui/Button';
import { verifyOtp } from '../api/auth';

export const TwoFactor = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const email =
    sessionStorage.getItem('authEmail') || 'jaghanav@acmecorp.com';

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const isValid = await verifyOtp(email, enteredOtp);

      if (isValid) {
        navigate('/success');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Unable to connect to the server. Please try again.');
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
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 text-red-700 text-sm">
          <AlertCircle
            size={18}
            className="mt-0.5 flex-shrink-0"
          />

          <div>
            <p className="font-semibold">Verification failed</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-between my-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(index, e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(index, e)
            }
            className="w-12 h-14 text-center text-xl font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
          />
        ))}
      </div>

      <div className="text-center text-sm text-slate-500 mb-2">
        Code expires in 04:57 ·{' '}
        <button
          type="button"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Resend code
        </button>{' '}
        ·{' '}
        <button
          type="button"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Use a backup code
        </button>
      </div>

      <PrimaryButton
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify and sign in'}
      </PrimaryButton>

      <div className="text-center text-sm text-slate-500 mt-4 border-t border-slate-100 pt-6">
        Having trouble?{' '}
        <a
          href="#"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Contact support
        </a>
      </div>
    </div>
  );
};
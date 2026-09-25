import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';

export const CheckEmail = () => {
  const navigate = useNavigate();

  const email =
    localStorage.getItem('resetEmail') || 'you@acmecorp.com';

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-3">
        Check your email
      </h2>

      <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
        We've sent a password reset link to{' '}
        <strong className="text-slate-800">{email}</strong>.
        <br />
        The link expires in 30 minutes.
      </p>

      <div className="w-full flex flex-col gap-3">
        <SecondaryButton onClick={() => navigate('/reset-password')}>
          Open reset link
        </SecondaryButton>

        <Link to="/login" className="w-full">
          <PrimaryButton>Back to sign in</PrimaryButton>
        </Link>
      </div>

      <div className="text-center text-sm text-slate-500 mt-6 border-t border-slate-100 pt-6 w-full">
        Didn't get it? Check spam, or{' '}
        <a
          href="#"
          className="font-semibold text-indigo-600 hover:underline"
        >
          contact support
        </a>
        .
      </div>
    </div>
  );
};
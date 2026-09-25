import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    if (!trimmedEmail) {
      setError("Work email is required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
        "authEmail",
        user.email
      );

      sessionStorage.setItem(
        "registrationOtp",
        user.otp
      );

      navigate(
        `/login?email=${encodeURIComponent(
          user.email
        )}`
      );
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExistingUserSignIn = () => {
    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      navigate("/login");
      return;
    }

    sessionStorage.setItem(
      "authEmail",
      trimmedEmail
    );

    sessionStorage.removeItem(
      "registrationOtp"
    );

    navigate(
      `/login?email=${encodeURIComponent(
        trimmedEmail
      )}`
    );
  };

  const isExistingUserError =
    error
      .toLowerCase()
      .includes("already exists");

  const handleSignIn = () => {
    const trimmedEmail =
      email.trim().toLowerCase();

    if (trimmedEmail) {
      sessionStorage.setItem(
        "authEmail",
        trimmedEmail
      );

      navigate(
        `/login?email=${encodeURIComponent(
          trimmedEmail
        )}`
      );

      return;
    }

    navigate("/login");
  };

  return (
    <div className="w-full max-w-[480px]">

      <div className="mb-8">

        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase mb-3">
          STEP 1 OF 2 · REGISTRATION
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Create your account
        </h1>

        <p className="text-slate-500">
          Register to continue.
        </p>

      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4">

          <div className="flex gap-3 text-red-700">

            <span className="mt-0.5 shrink-0 text-lg">
              ⚠
            </span>

            <div>

              <p className="font-semibold text-sm">
                Registration failed
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>

          {isExistingUserError && (
            <button
              type="button"
              onClick={
                handleExistingUserSignIn
              }
              className="w-full mt-4 h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Sign in with this email
            </button>
          )}

        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleRegister();
        }}
        className="space-y-5"
      >

        <div>

          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={loading}
            className="w-full h-14 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60"
          />

        </div>

        <div>

          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Work Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="you@acmecorp.com"
            autoComplete="email"
            disabled={loading}
            className="w-full h-14 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60"
          />

        </div>

        <div>

          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>

          <div className="relative">

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
                setError("");
              }}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              className="w-full h-14 px-4 pr-12 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                  <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 8.5 5 8.5 5a16.16 16.16 0 0 1-2.17 2.57" />
                  <path d="M6.61 6.61C3.82 8.57 2 12 2 12s3.5 5 10 5a9.77 9.77 0 0 0 2.12-.24" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>
              )}
            </button>

          </div>

        </div>

        <div>

          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Confirm Password
          </label>

          <div className="relative">

            <input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(
                  event.target.value
                );
                setError("");
              }}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
              className="w-full h-14 px-4 pr-12 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
            >
              {showConfirmPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                  <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 8.5 5 8.5 5a16.16 16.16 0 0 1 2.17 2.57" />
                  <path d="M6.61 6.61C3.82 8.57 2 12 2 12s3.5 5 10 5a9.77 9.77 0 0 0 2.12-.24" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>
              )}
            </button>

          </div>

        </div>

        <p className="text-sm text-slate-500 -mt-2">
          Password must contain at least 8 characters.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Creating account..."
            : "Create Account →"}
        </button>

      </form>

      <div className="text-center text-sm text-slate-500 border-t border-slate-100 pt-6 mt-7">

        Already have an account?

        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          className="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
        >
          Sign in
        </button>

      </div>

    </div>
  );
}
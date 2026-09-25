export const Success = () => {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        You're in
      </h2>

      <p className="text-slate-500">
        Redirecting to your dashboard...
      </p>
    </div>
  );
};
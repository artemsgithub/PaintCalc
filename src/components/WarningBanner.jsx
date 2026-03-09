export default function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {warnings.map((w) => (
        <div
          key={w.id}
          className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3"
        >
          <span className="mt-0.5 text-amber-500" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-sm text-amber-800">{w.message}</p>
        </div>
      ))}
    </div>
  );
}

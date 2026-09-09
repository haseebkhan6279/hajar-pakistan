import { useEffect } from "react";

export function Toast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm border border-hj-border bg-white px-4 py-3 text-sm text-hj-ink shadow-[0_12px_32px_rgb(18_16_12/0.10)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-hj-gold" />
      {message}
    </div>
  );
}

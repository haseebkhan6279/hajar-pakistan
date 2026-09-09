"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          color: "#12100c",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 400 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#7c7466", fontSize: "0.9rem" }}>
            Please reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "3rem",
              padding: "0 1.75rem",
              background: "#12100c",
              color: "#e7cd8a",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.7rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

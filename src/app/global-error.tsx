"use client";

export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <h1 style={{ fontSize: "2rem", color: "white" }}>Something went wrong</h1>
        </div>
      </body>
    </html>
  );
}

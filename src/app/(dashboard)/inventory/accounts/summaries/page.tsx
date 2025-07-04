"use client";

export default function AccountsSummariesPage() {
  const request = window.location.href;

  return (
    <div>
      <h1>Accounts Summaries {request}</h1>
    </div>
  );
}
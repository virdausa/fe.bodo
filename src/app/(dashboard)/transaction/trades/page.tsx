"use client";

export default function TradesPage() {
  const request = window.location.href;

  return (
    <div>
      <h1>{request}</h1>
    </div>
  );
}
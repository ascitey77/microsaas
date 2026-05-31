import { Suspense } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>{children}</Suspense>;
}

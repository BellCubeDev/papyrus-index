import { Suspense } from "react";

export function SuspenseIfDevelopment({children, fallback}: {readonly children: React.ReactNode, readonly fallback?: React.ReactNode}) {
    if (process.env.NODE_ENV !== 'development') return children;

    return <Suspense fallback={fallback}>{children}</Suspense>;
}

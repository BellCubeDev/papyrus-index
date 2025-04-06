import { Suspense } from "react";

export function SuspenseIfServer({children, fallback}: {readonly children: React.ReactNode, readonly fallback?: React.ReactNode}) {
    if (typeof window !== 'undefined') return children;

    return <Suspense fallback={fallback}>{children}</Suspense>;
}

import { SuspenseIfDevelopment } from "@/app/components/SuspenseIfDevelopment";

export function SuspenseIfDevServer({children, fallback}: {readonly children: React.ReactNode, readonly fallback?: React.ReactNode}) {
    if (typeof window !== 'undefined') return children;

    return <SuspenseIfDevelopment fallback={fallback}>{children}</SuspenseIfDevelopment>;
}

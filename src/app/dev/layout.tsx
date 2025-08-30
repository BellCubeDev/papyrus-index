import { notFound } from "next/navigation";

export default function DevLayout({children}: LayoutProps<'/dev'>) {
    if (process.env.NODE_ENV === 'production') return notFound();
    return <>
        {children}
    </>
}

import { ComponentProps } from "react";
import type { Geiger } from "@/client-component-shims/react-geiger";

export async function ReactGeigerDevOnly(props: ComponentProps<typeof Geiger>) {
    if (process.env.NODE_ENV === 'production') return props.children;

    const { Geiger } = await import("@/client-component-shims/react-geiger");
    return <Geiger {...props} />;
}

import React from "react";

export function GuardEmptyList({replacement, children, Wrapper}: {readonly replacement: React.ReactNode, readonly children: React.ReactNode, readonly Wrapper?: React.ComponentType<{readonly children: React.ReactNode}>}) {
    if (React.Children.count(children) === 0) return replacement;
    return Wrapper ? <Wrapper>{children}</Wrapper> : <>{children}</>;
}

export function joinJSX(separator: React.ReactNode, items: React.ReactNode[]): React.ReactNode[] {
    return items.reduce((acc: React.ReactNode[], curr: React.ReactNode, index) => {
        if (index === 0) return [curr];
        acc.push(separator, curr);
        return acc;
    }, []);
}

export function joinJSXWithElement(items: [preSeparator: React.ReactNode, realElement: React.ReactNode][]): React.ReactNode[] {
    return items.reduce((acc, [preSeparator, realElement], index) => {
        if (index === 0) return [realElement];
        acc.push(preSeparator, realElement);
        return acc;
    }, [] as React.ReactNode[]);
}

export function joinJSXWithElementByWrapping(ChildWrapper: (props:{children: React.ReactNode}) => React.ReactNode, items: {wrapperKey: string, realElement: React.ReactNode, postSeparator: React.ReactNode}[]): React.ReactNode[] {
    return items.reduce((acc, {wrapperKey, realElement, postSeparator}, index) => {
        if (index === items.length - 1) acc.push(<ChildWrapper key={wrapperKey}>{realElement}</ChildWrapper>);
        else acc.push(<ChildWrapper key={wrapperKey}>{realElement}{postSeparator}</ChildWrapper>);
        return acc;
    }, [] as React.ReactNode[]);
}

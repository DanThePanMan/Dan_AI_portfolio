import React from "react";

type RowPropType = {
    line: string;
};

const Row = (props: RowPropType) => {
    const line = props.line;

    return <div>{line}</div>;
};

export default Row;

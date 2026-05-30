'use client';

import { NotFoundChip } from "./components/NotFoundChip";

//import {redirect} from 'next/navigation';

const buttonStyle = {
    fontSize: '1.1em',
    padding: '0.5em 1em',
    cursor: 'pointer',
    background: '#fff1',
    border: 'none',
    borderRadius: '0.2em',
    margin: '0.75em',
} satisfies React.CSSProperties;

export default function NotFoundPage() {
    return <div style={{margin: 'auto', maxWidth: '60ch', padding: '6rem', textAlign: 'center'}}>
        <h1> <NotFoundChip emSize={1.5} /> </h1>
        <p>The page you&rsquo;re looking for does not exist.</p>
        <br />
        <p style={{marginTop: '4em'}}>
            <button type="button" onClick={() => {window.history.back()}} style={buttonStyle}>Go back</button>
            {" ∘︎ "}
            <button type="button" onClick={() => {window.location.href = '/'}} style={buttonStyle}>Go home</button>
        </p>
    </div>;
}

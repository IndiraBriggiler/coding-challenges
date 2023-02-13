import React, { useState } from 'react';

interface HexViewerProps {
  data: string | Uint8Array;
  offset: number;
}

export default function HexViewer({ data, offset: startOffset }: HexViewerProps) {

  const lines: React.ReactElement[] = [];
  const [cursor, setCursor] = useState<number>();
  const BYTES_PER_LINE = 16;
  const toHex = (n: number, length: number) => n.toString(16).padStart(length, '0');

  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    data = encoder.encode(data);
  }

  for (let lineNumber = 0; lineNumber < data.length / BYTES_PER_LINE; lineNumber++) {

    const offset = startOffset + (lineNumber * BYTES_PER_LINE);

    const slice = Array.from(data.slice(offset, offset + BYTES_PER_LINE));

    const offsetComponent = <span>{toHex(offset, 8)}: </span>;

    const onSelectedItem = (offset: number, value: string) => {
      setCursor(offset);
      navigator.clipboard.writeText(value);
    }

    const bytes = slice.map((byte, i) => {
      const spacing = ((i + 1) % 4 === 0) ? '  ' : ' ';
      const hex = toHex(byte, 2);
      if (offset + i === cursor) {
        return <div key={offset + i} >
          <span className="highlight">{hex}</span>
          <span>{spacing}</span>
        </div>;
      }

      return <span key={offset + i} onClick={() => onSelectedItem(offset + i, hex)}>{hex}{spacing}</span>;

    });

    if (bytes.length < BYTES_PER_LINE) {
      const wordSpaces = 4 - Math.floor(bytes.length / 4);
      const diff = BYTES_PER_LINE - bytes.length;
      const padding = <span key='padding'>{'   '.repeat(diff)}{' '.repeat(wordSpaces)}</span>;
      bytes.push(padding);
    }

    const bytesComponent = <div className='bytesComponent'>{bytes}</div>;
    const asciiComponent = <div className='asciiComponent'>
      {slice.map((byte, i) => {
        const char = (byte >= 0x20 && byte < 0x7f)
          ? String.fromCharCode(byte)
          : '.';

        if (offset + i === cursor) {
          return <span className="highlight" key={char + i}>{char}</span>
        }

        return <span onClick={() => onSelectedItem(offset + i, char)} key={char + i}>
          {char}
        </span>
      })}
      {slice.length < BYTES_PER_LINE && <span>
        {''.padStart(BYTES_PER_LINE - slice.length, ' ')}
      </span>}
    </div>;

    lines.push(<div key={offset} className="lines" > {offsetComponent}{bytesComponent} {asciiComponent}</div >);
  }

  return (
    <pre className='dataContainer' >
      <div className='linesContainer'>{lines}</div>
    </pre>
  );
}

import React from 'react';
import readFile from "./lib/readFile";
import HexViewer from "./components/HexViewer";

function App() {
  const [file, setFile] = React.useState<null | string | Uint8Array>(null);
  const updateFileState = async (e: React.FormEvent<HTMLInputElement>) => {
    const result = await readFile(e);
    setFile(result);
  }
  const [onHover, setOnHover] = React.useState(false);
  const toggleHover = () => setOnHover(!onHover);
  const isBinary = typeof file !== 'string';

  return (
    <div className="App">
      <header id="header" onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        <a target="_blank" href="https://www.fiskaly.com/">
          <figure className="logoContainer">
            <img src="assets/img/logoBlack.svg" alt="Fiskaly logo" className={onHover ? '' : 'hidden'}
            />
            <img src="assets/img/logoWhite.svg" alt="Fiskaly logo" className={onHover ? 'hidden' : ''}
            />
          </figure>
        </a>
      </header>

      <section className='titleContainer'>
        <span className='title'>Hex Viewer</span>
        <div className='divider'></div>
        <div className='actionsContainer'>
          {!file ?
            (<input
              name="file"
              type="file"
              role="button"
              onInput={updateFileState}
            />) : (
              <div className='resetContainer'>
                <span>Loaded <span className='bold'> {isBinary ? 'binary' : 'text'}</span> file</span>
                <button className='button' onClick={() => setFile(null)}>Reset</button></div>
            )}</div>
      </section>
      {file && <HexViewer data={file} offset={0} />}
    </div>
  );
}

export default App;

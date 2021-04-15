import { useState } from 'react';
import './App.css';
import FormWrapper from './Components/Forms/FormWrapper';

function App() {

    const [previewJson, setPreviewJson] = useState([])

  return (
    <div className="App">
      <FormWrapper setPreviewJson={setPreviewJson} previewJson={previewJson}/>

      {/* This is just a placeholder */}
        
      <pre>{JSON.stringify(previewJson)}</pre>
    </div>
  );
}

export default App;

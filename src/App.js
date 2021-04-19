import { useState } from 'react';
import './App.css';
import Menu from './Components/Appbar/Menu';
import FormWrapper from './Components/Forms/FormWrapper';


function App() {

    const [previewJson, setPreviewJson] = useState([])

  return (
    <div className="App">
      <Menu/>
      <FormWrapper setPreviewJson={setPreviewJson} previewJson={previewJson}/>

      {/* This is just a placeholder */}
        
      <pre>{JSON.stringify(previewJson, null, 2)}</pre>
    </div>
  );
}

export default App;

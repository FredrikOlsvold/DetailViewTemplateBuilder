import './App.css';
import Menu from './Components/Appbar/Menu';
import FormWrapper from './Components/Forms/FormWrapper';


function App() {

  return (
    <div className="App">
      <Menu/>

      <FormWrapper wrapperType={"titleWrapper"}/>

      {/* <FormWrapper contentWrapper={"contentWrapper"}/> */}

        
    </div>
  );
}

export default App;

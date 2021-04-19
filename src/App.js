import './App.css';
import Menu from './Components/Appbar/Menu';
import Dashboard from "./Components/containers/Dashboard";
import {atom} from "recoil";
import ShowAll from "./Components/RecoilTest/ShowAll";


  //Atom that stores all fields in a list. Global state
  export const fieldListAtom = atom({
    key: "fieldListAtom",
    default: [],
  });

  //Atom that stores chosen templates in a list. Global state
  export const chosenTemplateAtom = atom({
    key: "chosenTemplateAtom",
    default: "",
  });

function App() {

  return (
    <div className="App">
      <Menu/>
      <Dashboard/>
      <ShowAll/>
    </div>
  );
}

export default App;

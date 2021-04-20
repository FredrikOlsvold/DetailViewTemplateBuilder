import './App.css';
import Menu from './Components/Appbar/Menu';
import Dashboard from "./Components/containers/Dashboard";
import {atom} from "recoil";
import ShowAll from "./Components/RecoilTest/ShowAll";
import { Grid } from "@material-ui/core";
import ListAllTemplates from './Components/Forms/ViewAllTemplates/ListAllTemplates';
import TemplateMapping from "../src/Components/Forms/Mapping/TemplateMapping";


  //Atom that stores all fields in a list. Global state
  export const fieldListAtom = atom({
    key: "fieldListAtom",
    default: [],
  });


function App() {

  return (
    <div className="App">
      <Grid container spacing={1}>
          <Grid item xs={2}>
            <ListAllTemplates/>
          </Grid>


          <Grid item xs={10}> 
            <TemplateMapping/>     
            <Dashboard/>
            <ShowAll/>
          </Grid>



      </Grid>
      
    </div>
  );
}

export default App;

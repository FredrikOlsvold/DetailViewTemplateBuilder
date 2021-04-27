import './App.css';
import Dashboard from "./Components/containers/Dashboard";
import {atom} from "recoil";
import { Grid, Typography } from "@material-ui/core";
import ListAllTemplates from './Components/templateMenu/ListAllTemplates';
import TemplateMapping from "./Components/containers/Mapping/TemplateMapping";
import OutputDisplayWrapper from "./Components/containers/OutputDisplayWrapper";


  //Atom that stores all fields in a list. Global state
  export const fieldListAtom = atom({
    key: "fieldListAtom",
    default: [],
  });


function App() {

  return (
    <div className="App">
      <div style={{ marginTop: "2em", textAlign: "center" }}>
        <Typography variant="h4">Detail View Templates</Typography>
      </div>
      <Grid container spacing={1}>
        
            {/* <ListAllTemplates/> */}
         

          <Grid item xs={9}> 
            {/* <TemplateMapping/>      */}
            <Dashboard/>
            <OutputDisplayWrapper/>
          </Grid>

      </Grid>
      
    </div>
  );
}

export default App;

import './App.css';
import Dashboard from "./components/containers/Dashboard";
import {atom} from "recoil";
import { Grid, Typography } from "@material-ui/core";
import ListAllTemplates from './components/templateMenu/ListAllTemplates';
import TemplateMapping from "./components/containers/mapping/TemplateMapping";
import OutputDisplayWrapper from "./components/containers/OutputDisplayWrapper";
import EngineRunner from "./engine/EngineRunner";
import "./engine/EngineRenderer";


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
            <detail-view/>
         

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

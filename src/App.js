import "./App.css";
import Dashboard from "./components/containers/Dashboard";
import { atom } from "recoil";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import ListAllTemplates from "./components/templateMenu/ListAllTemplates";
import TemplateMapping from "./components/containers/mapping/TemplateMapping";
import OutputDisplayWrapper from "./components/containers/OutputDisplayWrapper";
import DetailViewPreview from "./components/views/DetailViewPreview";

//Atom that stores all fields in a list. Global state
export const fieldListAtom = atom({
  key: "fieldListAtom",
  default: [],
});

function App() {
  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item xs={1}>
        <Typography variant="h4">Detail View Templates</Typography>
      </Grid>
      <Grid item xs={6}>
        <Dashboard />
      </Grid>
      <Grid item xs={4}>
      <OutputDisplayWrapper />
        
      </Grid>
    </Grid>
    // <div className="App">
    // <div>

    // </div>
    //   {/* <Grid
    //     container
    //     alignItems="center"
    //     justify="center"
    //     spacing={1}
    //     width="50%"
    //   >
    //     <Grid item>
    //     </Grid>
    //   </Grid> */}
    // </div>
  );
}

export default App;

import "./App.css";
import Dashboard from "./components/containers/Dashboard";
import { atom } from "recoil";
import { Grid, Typography } from "@material-ui/core";
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
    <div className="App">
      <div style={{ marginTop: "2em", textAlign: "center" }}>
        <Typography variant="h4">Detail View Templates</Typography>
      </div>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minWidth: "50vw" }}
        spacing={1}
      >
        <Grid item xs={6}>
          <Dashboard />
          <OutputDisplayWrapper />
        </Grid>
        
      </Grid>
    </div>
  );
}

export default App;

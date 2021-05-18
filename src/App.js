import "./App.css";
import Dashboard from "./components/containers/Dashboard";
import { atom } from "recoil";
import { Box, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
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
    <>
      <Typography variant="h4">Detail View Template</Typography>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={9}>
          <Dashboard />
        </Grid>

        <Grid item xs={6}>
          <OutputDisplayWrapper />
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: "2em", margin: "1em" }}>
            <Typography variant="h6">Preview of detailview</Typography>
            <DetailViewPreview />
          </Paper>
        </Grid>
      </Grid>
    </>
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

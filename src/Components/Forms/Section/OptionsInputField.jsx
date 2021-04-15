import { TextField, Grid } from "@material-ui/core";

function OptionsInputField() {
  return (
    <>
      <Grid item xs={6}>
        <TextField
          id="key"
          label="Key"
          variant="outlined"
          style={{ width: "100%" }}
        ></TextField>
        <TextField
          id="value"
          label="Value"
          variant="outlined"
          style={{ width: "100%" }}
        ></TextField>
      </Grid>
    </>
  );
}

export default OptionsInputField;

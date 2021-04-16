import { TextField, Grid, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

function OptionsInputField({
  removeOptions,
  handleKeyInput,
  handleValueInput,
  addOption,
}) {
  return (
    <>
      <Grid item xs={4}>
        <TextField
          id="key"
          label="Key"
          variant="outlined"
          style={{ width: "100%" }}
          onChange={handleKeyInput}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="value"
          label="Value"
          variant="outlined"
          style={{ width: "100%" }}
          onChange={handleValueInput}
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          type="button"
          variant="contained"
          color="default"
          startIcon={<Delete />}
          onClick={removeOptions}
        >
          Remove
        </Button>
      </Grid>
    </>
  );
}

export default OptionsInputField;

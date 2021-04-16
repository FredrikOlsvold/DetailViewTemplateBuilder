import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useEffect, useState } from "react";
import OptionsInputField from "./OptionsInputField";

function SectionForm() {
  const [type, setType] = useState();
  const [enableOptions, setEnableOptions] = useState([]);

  const [optionsKey, setOptionsKey] = useState([]);
  const [optionsValue, setOptionsValue] = useState("");

  const handleAddOptions = () => {
    const values = [...enableOptions];
    values.push([]);
    setEnableOptions(values);
  };

  const handleRemoveOptions = (i) => {
    const values = [...enableOptions];
    values.splice(i, 1);
    setEnableOptions(values);
    setOptionsKey(values);
  };

  return (
    <>
      {/* TYPE DROPDOWN */}
      <Grid item xs={6}>
        <TextField
          id="select"
          select
          style={{ width: "100%" }}
          value={type}
          label="Type"
          variant="outlined"
        >
          <MenuItem value="" />
          <MenuItem value={1}>Type 1</MenuItem>
          <MenuItem value={2}>Type 2</MenuItem>
          <MenuItem value={3}>Type 3</MenuItem>
        </TextField>
      </Grid>

      {/* OPTION BUTTON */}
      <Grid item xs={6}>
        <Button
          type="button"
          variant="contained"
          color="default"
          startIcon={<Add />}
          onClick={handleAddOptions}
        >
          Options
        </Button>
      </Grid>
      <pre>{JSON.stringify(type)}</pre>
      {/* ENABLE OPTIONSINPUTFIELDS */}
      {enableOptions.map((input, i) => (
        <OptionsInputField
          key={i}
          removeOptions={handleRemoveOptions}
          handleKeyInput={(e) => setOptionsKey(e.target.value)}
          handleValueInput={(e) => setOptionsValue(e.target.value)}
        />
      ))}
    </>
  );
}

export default SectionForm;

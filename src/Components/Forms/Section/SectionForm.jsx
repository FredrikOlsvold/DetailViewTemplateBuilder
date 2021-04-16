import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, ExpandMore } from "@material-ui/icons";
import { useEffect, useState } from "react";
import OptionsInputField from "./OptionsInputField";

function SectionForm() {
  const [Type, setType] = useState();
  const [enableOptions, setEnableOptions] = useState([]);

  const [key, setKey] = useState("");

  const handleAddOptions = () => {
    const values = [...enableOptions];
    values.push([]);
    setEnableOptions(values);
  };

  const handleRemoveOptions = (i) => {
    const values = [...enableOptions];
    values.splice(i, 1);
    setEnableOptions(values);
  };

  const handleChangeOptions = (i, e) => {
    const values = [...enableOptions];
    values[i].value = e.target.value;
    setEnableOptions(values);
  };

  useEffect(() => {}, []);

  const handleInputKey = (e) => {
    setKey(e.value.change);
  };

  return (
    <>
      
        {/* TYPE DROPDOWN */}
        <Grid item xs={6}>
          <TextField
            id="select"
            select
            style={{ width: "100%" }}
            value={Type}
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

        {/* ENABLE OPTIONSINPUTFIELDS */}
        {enableOptions.map((i) => (
          <OptionsInputField removeOptions={handleRemoveOptions} />
        ))}
      
    </>
  );
}

export default SectionForm;

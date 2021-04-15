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

  //const handleOptionsClicked = () => setEnabled(true);

  const handleOptionsClicked = () => {
    setEnableOptions(
      enableOptions.concat(<OptionsInputField key={enableOptions.length} />)
    );
  };

  useEffect(() => {}, []);

  const handleInputKey = (e) => {
    setKey(e.value.change);
  };

  return (
    <>
      {/* CHANGE TO ACCORDION */}
      <div style={{ width: "50%" }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Section</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl>
              <Grid container spacing={3}>
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
                    variant="contained"
                    color="default"
                    startIcon={<Add />}
                    onClick={handleOptionsClicked}
                  >
                    Options
                  </Button>
                </Grid>

                {/* ENABLE OPTIONSINPUTFIELDS */}
                {enableOptions}
              </Grid>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}

export default SectionForm;

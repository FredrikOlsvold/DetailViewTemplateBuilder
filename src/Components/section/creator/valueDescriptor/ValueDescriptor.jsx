import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { dataTypes } from "../../../../api/getData";
import { uniqueGuid } from "../../../../helpers/HelperMethods";
import SaveIcon from "@material-ui/icons/Save";
import Edit from "@material-ui/icons/Edit";

function ValueDescriptor({
  sectionValueDescriptorPath,
  setSectionValueDescriptorPath,
  sectionValueDescriptorType,
  setSectionValueDescriptorType,
  updateValueDescriptor,
}) {
  const [disable, setDisable] = useState(false);

  const saveButtonOnClick = () => {
    updateValueDescriptor();
    setDisable(!disable);
  };
  const onValueDescriptorPathChange = (e) => {
    setSectionValueDescriptorPath(e.target.value);
  };

  const onValueDescriptorTypeChange = (e) => {
    setSectionValueDescriptorType(e.target.value);
  };

  return (
    <>
      <Typography>Section value descriptor</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id={uniqueGuid()}
            label="Path"
            value={sectionValueDescriptorPath}
            variant="outlined"
            fullWidth
            onChange={onValueDescriptorPathChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            id={uniqueGuid()}
            label="Value Type"
            value={sectionValueDescriptorType}
            variant="outlined"
            fullWidth
            onChange={onValueDescriptorTypeChange}
          >
            {Object.keys(dataTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <Button
            type="button"
            variant="contained"
            color="default"
            size="small"
            startIcon={disable ? <Edit /> : <SaveIcon />}
            onClick={saveButtonOnClick}
            style={{ marginBottom: "2em" }}
          >
            Save section value descriptor
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ValueDescriptor;

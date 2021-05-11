import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { dataTypes } from "../../../../api/getData";
import { uniqueGuid } from "../../../../helpers/HelperMethods";
import SaveIcon from "@material-ui/icons/Save";

function ValueDescriptor({
  sectionValueDescriptorPath,
  setSectionValueDescriptorPath,
  sectionValueDescriptorType,
  setSectionValueDescriptorType,
  updateValueDescriptor
}) {
  const onValueDescriptorPathChange = (e) => {
    setSectionValueDescriptorPath(e.target.value);
  };

  const onValueDescriptorTypeChange = (e) => {
    setSectionValueDescriptorType(e.target.value);
  };

  return (
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
          startIcon={<SaveIcon />}
          onClick={updateValueDescriptor}
          style={{ marginBottom: "2em" }}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

export default ValueDescriptor;

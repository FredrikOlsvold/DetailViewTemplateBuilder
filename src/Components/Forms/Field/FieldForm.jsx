import { MenuItem, TextField } from "@material-ui/core";
import React from "react";

function FieldForm() {
  return (
    <>
      <TextField id="select" label="Field Type" select>
          {/* Map MenuItems based on type options accessible from data source 
            eg. data.types.map(t => {
            <MenuItem value={t.value}>{t.name}</MenuItem>

            })
          */}
        <MenuItem value="1">Type 1</MenuItem>
        <MenuItem value="2">Type 2</MenuItem>
        <MenuItem value="3">Type 3</MenuItem>
      </TextField>
      <TextField id="standard-basic" label="Label"/>
    </>
  );
}

export default FieldForm;

import { MenuItem, TextField } from "@material-ui/core";
import React from "react";

const MenuTypes = ({
  id,
  select,
  value,
  label,
  variant,
  onChange,
  error,
  helperText,
}) => {
  return (
    <>
      <TextField
        required
        fullWidth
        id={id}
        select={select}
        value={value}
        label={label}
        variant={variant}
        onChange={onChange}
        error={error}
        helperText={helperText}
      >
        <MenuItem value="" />
        <MenuItem value={"Header"}>Header</MenuItem>
        <MenuItem value={"Standard"}>Standard</MenuItem>
        <MenuItem value={"Column"}>Column</MenuItem>
        <MenuItem value={"ClickableList"}>ClickableList</MenuItem>
        <MenuItem value={"Table"}>Table</MenuItem>
        <MenuItem value={"Type 6"}>Type 6</MenuItem>
        <MenuItem value={"Tab"}>Tab</MenuItem>
        <MenuItem value={"ExternalData"}>ExternalData</MenuItem>
      </TextField>
    </>
  );
};

export default MenuTypes;

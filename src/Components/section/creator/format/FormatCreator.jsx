import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import React, { useState } from "react";
import {
  removeItemAtIndex,
  replaceItemAtIndex,
  uniqueGuid,
  unformatFormatList,
} from "../../../../helpers/HelperMethods";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { dataTypes } from "../../../../api/getData";

const FormatCreator = ({
  item,
  setFormatters,
  formatters,
  mode,
  valueType,
}) => {
  const index = formatters.findIndex((optionItem) => optionItem === item);
  const [formatKey, setFormatKey] = useState(item.Key);
  const [formatValue, setFormatValue] = useState(item.Value);
  const [disabledValue, setDisabledValue] = useState(
    mode === "create" ? false : true
  );
  
  const onFormatKeyChange = ({ target: { value } }) => {
    setFormatKey(value);
  };
  const onFormatValueChange = ({ target: { value } }) => {
    setFormatValue(value);
  };

  const updateFormatters = () => {
    const newFormattersList = replaceItemAtIndex(formatters, index, {
      ...item,
      Key: formatKey,
      Value: formatValue,
    });

    setFormatters(newFormattersList);
    setDisabledValue(!disabledValue);
    if (mode === "edit") {
      //   setSectionUpdated(!sectionUpdated);
    }
  };

  const removeItem = async () => {
    if (mode === "create") {
      const newFormattersList = removeItemAtIndex(formatters, index);
      setFormatters(newFormattersList);
    } else {
      console.log("Index", index);
      console.log("Item", item);
      console.log("Formatters", formatters);
      const newFormattersList = removeItemAtIndex(formatters, index);
      await setFormatters(newFormattersList);
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            select
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Format"
            value={formatKey}
            variant="outlined"
            fullWidth
            onChange={onFormatKeyChange}
          >
            {dataTypes[valueType] &&
              dataTypes[valueType].map((funcType) => (
                <MenuItem key={funcType} value={funcType}>
                  {funcType}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            disabled={disabledValue}
            id={uniqueGuid()}
            label="format value"
            value={formatValue}
            variant="outlined"
            fullWidth
            onChange={onFormatValueChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {mode === "create" && (
          <Grid item>
            <Button
              size="small"
              type="button"
              variant="contained"
              color="default"
              startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
              onClick={updateFormatters}
            >
              {disabledValue ? "Edit" : "Save"}
            </Button>
          </Grid>
        )}

        {mode === "edit" && (
          <Grid item>
            <Button
              size="small"
              type="button"
              variant="contained"
              color="default"
              startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
              onClick={() => {
                if (disabledValue === true) {
                  //Nothing?
                } else {
                  updateFormatters();
                }
                setDisabledValue(!disabledValue);
              }}
            >
              {disabledValue ? "Edit" : "Save"}
            </Button>
          </Grid>
        )}

        <Grid item>
          <Button
            size="small"
            type="button"
            variant="contained"
            color="default"
            startIcon={<DeleteIcon />}
            onClick={removeItem}
          >
            DELETE
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormatCreator;

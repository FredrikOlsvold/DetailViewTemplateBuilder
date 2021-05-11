import React, { useState } from "react";
import { TextField, Grid, Button, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
} from "../../../../helpers/HelperMethods";
import { optionTypes } from "../../../../api/getData";

function OptionsCreator({
  setOptionList,
  item,
  sectionUpdated,
  optionList,
  mode,
  deleteOption,
  setSectionUpdated,
  updateFields,
  optionOrigin,
}) {
  // optionOrigin={"sectionOptionOrigin"}
  const index =
    mode === "create" || optionOrigin === "sectionOptionOrigin"
      ? optionList.findIndex((optionItem) => optionItem === item)
      : optionList.findIndex((optionItem) => optionItem.Key === item.Key);
  const [optionKey, setOptionKey] = useState(item.Key);
  const [optionValue, setOptionValue] = useState(item.Value);
  const [disabledValue, setDisabledValue] = useState(
    mode === "create" ? false : true
  );

  const onOptionKeyChange = ({ target: { value } }) => {
    setOptionKey(value);
  };
  const onOptionValueChange = ({ target: { value } }) => {
    setOptionValue(value);
  };

  const updateOptions = async () => {
    const newOptionList = replaceItemAtIndex(optionList, index, {
      ...item,
      Id: item.Id,
      Key: optionKey,
      Value: optionValue,
    });

    await setOptionList(newOptionList);
    setDisabledValue(!disabledValue);
    if (mode === "edit") {
      // updateFields();
      setSectionUpdated(!sectionUpdated);
    }
  };

  const removeItem = async () => {
    if (mode === "create") {
      const newOptionList = removeItemAtIndex(optionList, index);
      await setOptionList(newOptionList);
    } else {
      const newOptionList = removeItemAtIndex(optionList, index);
      await setOptionList(newOptionList);
      // deleteOption();
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            select
            placeholder=""
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Key"
            value={optionKey}
            variant="outlined"
            fullWidth
            onChange={onOptionKeyChange}
            //   error={error}
            //   helperText={error}
          >
              {optionTypes && optionTypes.map((option, i) => (
                  <MenuItem key={i} value={option}>
                      {option}
                  </MenuItem>
              ))}

          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Value"
            value={optionValue}
            variant="outlined"
            fullWidth
            onChange={onOptionValueChange}
            //   error={error}
            //   helperText={error}
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
              onClick={updateOptions}
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
                  // setOptionValue(optionValue);
                  // setOptionKey(optionKey);
                } else {
                  updateOptions();
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
    </>
  );
}

export default OptionsCreator;

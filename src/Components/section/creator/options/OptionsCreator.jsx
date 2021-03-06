import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
} from "../../../../helpers/HelperMethods";

function OptionsCreator({
  setOptionList,
  item,
  sectionUpdated,
  optionList,
  mode,
  deleteOption,
  setSectionUpdated,
}) {
  const index = optionList.findIndex((optionItem) => optionItem === item);
  const [optionKey, setOptionKey] = useState(item.Key);
  const [optionValue, setOptionValue] = useState(item.Value);
  const [disabledValue, setDisabledValue] = useState(
    mode === "create" ? false : true
  );

  const [error, setError] = useState("");

  const onOptionKeyChange = ({ target: { value } }) => {
    setOptionKey(value);
    //value.preventDefault();
    //setError("");
  };
  const onOptionValueChange = ({ target: { value } }) => {
    setOptionValue(value);
    //setError("");
    //setDisabledValue(disabledValue);
  };

  const updateOptions = () => {
    // if (optionKey !== "" || optionValue !== "") {
    //   setError("Required field!");
    //   setDisabledValue(disabledValue);
    // }
    const newOptionList = replaceItemAtIndex(optionList, index, {
      ...item,
      Key: optionKey,
      Value: optionValue,
    });

    setOptionList(newOptionList);
    setDisabledValue(!disabledValue);
    if (mode === "edit") {
      setSectionUpdated(!sectionUpdated);
    }
  };

  const removeItem = () => {
    if (mode === "create") {
      const newOptionList = removeItemAtIndex(optionList, index);
      setOptionList(newOptionList);
    } else {
      const newOptionList = removeItemAtIndex(optionList, index);
      setOptionList(newOptionList);
      deleteOption();
    }
  };

  return (
    <>
      <div>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              disabled={disabledValue}
              id={uniqueGuid()}
              label="Key"
              value={optionKey}
              variant="outlined"
              fullWidth
              onChange={onOptionKeyChange}
              //   error={error}
              //   helperText={error}
            />
          </Grid>
          <Grid item>
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
                    setOptionValue(optionValue);
                    setOptionKey(optionKey);
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
      </div>
    </>
  );
}

export default OptionsCreator;

import { Button, Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { removeItemAtIndex, replaceItemAtIndex, uniqueGuid } from "../../../../helpers/HelperMethods";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";

const FormatCreator = ({ item, setFormatters, formatters, mode }) => {
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

  const removeItem = () => {
    if (mode === "create") {
      const newFormattersList = removeItemAtIndex(formatters, index);
      setFormatters(newFormattersList);
    } else {
    //   const newOptionList = removeItemAtIndex(formatters, index);
    //   setFormatters(newOptionList);
    //   deleteOption();
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Format"
            value={formatKey}
            variant="outlined"
            fullWidth
            onChange={onFormatKeyChange}
          />
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
      <Grid item>
              <Button
                size="small"
                type="button"
                variant="contained"
                color="default"
                startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
                onClick={() => { 
                if(mode === "create"){
                    updateFormatters()
                }
                }}
              >
                {disabledValue ? "Edit" : "Save"}
              </Button>
            </Grid>
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
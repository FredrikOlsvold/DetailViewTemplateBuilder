import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid
} from "../../Helpers/HelperMethods";

function OptionsCreator({ setOptionList, item, sectionUpdated, optionList, mode, deleteOption, setSectionUpdated}) {
  
  const index = optionList.findIndex((optionItem) => optionItem === item);
  const [optionKey, setOptionKey] = useState(item.key);
  const [optionValue, setOptionValue] = useState(item.value);
  const [disabledValue, setDisabledValue] = useState(false);
  const [disabledEditValue, setDisabledEditValue] = useState(false);

  const onOptionKeyChange = ({ target: { value } }) => {
      setOptionKey(value);   

  };
  const onOptionValueChange = ({ target: { value } }) => {
    setOptionValue(value);
  };

  const updateOptions = () => {
    const newOptionList = replaceItemAtIndex(optionList, index, {
      ...item,
      key: optionKey,
      value: optionValue,
    });

    console.log(disabledValue);
    setOptionList(newOptionList);
    setDisabledValue(!disabledValue);
    if(mode ==="edit"){
      setSectionUpdated(!sectionUpdated);
      setDisabledEditValue(!disabledEditValue);
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
              id= {uniqueGuid()}
              label="Key"
              value={optionKey}
              variant="outlined"
              style={{ width: "100%" }}
              onChange={onOptionKeyChange}
            />
          </Grid>
          <Grid item>
            <TextField
              disabled={disabledValue}
              id= {uniqueGuid()}
              label="Value"
              value={optionValue}
              variant="outlined"
              style={{ width: "100%" }}
              onChange={onOptionValueChange}
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
                onClick={updateOptions}
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
    </>
  );
}


export default OptionsCreator;

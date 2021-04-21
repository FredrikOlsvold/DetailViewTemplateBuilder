import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { windowTitleAtom, contentAtom } from "../../Atoms/atoms";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
} from "../../Helpers/HelperMethods";
import { useRecoilState } from "recoil";

function OptionsCreator({ setOptionList, item, optionList, mode, wrapper, deleteOption}) {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const [sectionList, setSectionList] = useRecoilState(chosenAtom);
  const index = optionList.findIndex((optionItem) => optionItem === item);

  const [optionKey, setOptionKey] = useState(item.key);
  const [optionValue, setOptionValue] = useState(item.value);


  const [disabledValue, setDisabledValue] = useState(false);
  

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

    setOptionList(newOptionList);
    setDisabledValue(!disabledValue);
  };

  const removeItem = () => {
    if (mode === "create") {
      const newOptionList = removeItemAtIndex(optionList, index);
      setOptionList(newOptionList);

    } else {
      console.log(item);
      const newOptionList = removeItemAtIndex(optionList, index);
      setOptionList(newOptionList);
      deleteOption();  

    }
  };

  return (
    <>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              disabled={disabledValue}
              id= {getUniqueId()}
              label="Key"
              value={optionKey}
              variant="outlined"
              style={{ width: "100%" }}
              onChange={onOptionKeyChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              disabled={disabledValue}
              id= {getUniqueId()}
              label="Value"
              value={optionValue}
              variant="outlined"
              style={{ width: "100%" }}
              onChange={onOptionValueChange}
            />
          </Grid>

          
            {mode === "create" && 
            <Grid item xs={2}>
            <Button
              type="button"
              variant="contained"
              color="default"
              startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
              onClick={updateOptions}
            >
              {disabledValue ? "Edit" : "Save"}
            </Button>
          </Grid>
            }
            

          <Grid item xs={2}>
            <Button
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

let uniqueId = 0;
const getUniqueId = () => {
  return uniqueId++;
};

export default OptionsCreator;

import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {replaceItemAtIndex, removeItemAtIndex} from "../../Helpers/HelperMethods";

function FieldsCreator({setFieldList, fieldList, item}) {

    const [fieldId, setFieldId] = useState(item.text.id);
    const [fieldType, setFieldType] = useState(item.text.type);
    const [fieldValue, setFieldValue] = useState(item.text.value);
    const [fieldFormat, setFieldFormat] = useState(item.text.format);
    const index = fieldList.findIndex((fieldItem) => fieldItem === item);
    const [disabledValue, setDisabledValue] = useState(false);

    const onFieldIdChange =({target: {value}}) => {setFieldId(value);};
    const onFieldTypeChange =({target: {value}}) => {setFieldType(value);};
    const onFieldValueChange =({target: {value}}) => {setFieldValue(value);};
    const onFieldFormatChange =({target: {value}}) => {setFieldFormat(value);};


    const updateFields = () => {
      const newFieldList = replaceItemAtIndex(fieldList, index, {
        ...item,
        text: {
            id:fieldId,
            type: fieldType,
            value: fieldValue,
            format: fieldFormat,
        },
    });

      setFieldList(newFieldList);
      setDisabledValue(!disabledValue);
    };

    const removeItem = () => {
      const newFieldList = removeItemAtIndex(fieldList, index);
      setFieldList(newFieldList);
  
    };

//     //Copied directly from recoil
// function removeItemAtIndex(arr, index) {
//   return [...arr.slice(0, index), ...arr.slice(index + 1)];
//   };

//   function replaceItemAtIndex(arr, index, newValue) {
//     return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
// };

  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={3}>
        <TextField
          id="fieldid"
          disabled={disabledValue}
          label="id"
          value={fieldId}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldIdChange}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="fieldtype"
          disabled={disabledValue}
          label="type"
          value={fieldType}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldTypeChange}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="fieldvalue"
          disabled={disabledValue}
          label="Value"
          value={fieldValue}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldValueChange}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="fieldformat"
          disabled={disabledValue}
          label="format"
          value={fieldFormat}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldFormatChange}
        />
      </Grid>

        <Grid item xs={2}>
        <Button
          type="button"
          variant="contained"
          color="default"
          size="small"
          startIcon={disabledValue ? <EditIcon /> : <SaveIcon/>}
          onClick={updateFields}
          style={{ marginBottom: "2em" }}
        >
          {disabledValue ? "Edit" : "Save"}
        </Button>
        </Grid>

      <Grid item xs={2}>
        <Button 
          type="button"
          size="small"
          variant="contained"
          color="default"
          startIcon={<DeleteIcon/>}
          onClick={removeItem}
          style={{ marginBottom: "2em" }}
          >DELETE</Button>
      </Grid>
      </Grid>
    </>
  );
}

export default FieldsCreator;

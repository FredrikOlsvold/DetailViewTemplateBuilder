import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
} from "../../Helpers/HelperMethods";

function FieldsCreator({
  sectionUpdated,
  setSectionUpdated,
  setFieldList,
  fieldList,
  item,
  mode,
  deleteField,
}) {
  const [fieldType, setFieldType] = useState(item.type);
  const [fieldValue, setFieldValue] = useState(item.value);
  const [fieldFormat, setFieldFormat] = useState(item.format);
  const [disabledValue, setDisabledValue] = useState(false);
  const index = fieldList.findIndex((fieldItem) => fieldItem === item);

  const onFieldTypeChange = ({ target: { value } }) => {
    setFieldType(value);
  };
  const onFieldValueChange = ({ target: { value } }) => {
    setFieldValue(value);
  };
  const onFieldFormatChange = ({ target: { value } }) => {
    setFieldFormat(value);
  };

  const updateFields = () => {
    const newFieldList = replaceItemAtIndex(fieldList, index, {
      ...item,
      // id: uniqueGuid(),
      type: fieldType,
      value: fieldValue,
      format: fieldFormat,
    });

    setDisabledValue(!disabledValue);
    // setDisabledValue(!disabledValue);
    if (mode === "edit") {
      setSectionUpdated(!sectionUpdated);
      // setDisabledEditValue(!disabledEditValue);
    }
    setFieldList(newFieldList);
  };

  const removeItem = () => {
    if (mode === "create") {
      const newFieldList = removeItemAtIndex(fieldList, index);
      setFieldList(newFieldList);
    } else {
      const newFieldList = removeItemAtIndex(fieldList, index);
      setFieldList(newFieldList);
      deleteField();
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
      </Grid>

      <Grid container spacing={2}>
        <Grid item>
          <Button
            type="button"
            variant="contained"
            color="default"
            size="small"
            startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
            onClick={updateFields}
            style={{ marginBottom: "2em" }}
          >
            {disabledValue ? "Edit" : "Save"}
          </Button>
        </Grid>

        <Grid item>
          <Button
            type="button"
            size="small"
            variant="contained"
            color="default"
            startIcon={<DeleteIcon />}
            onClick={removeItem}
            style={{ marginBottom: "2em" }}
          >
            DELETE
          </Button>
        </Grid>

        {/* <Button
          onClick={() => setDisabledValue(!disabledValue)}
          type="button"
          variant="contained"
          color="default"
          size="small"
          startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
          style={{ marginBottom: "2em" }}
        >
          {disabledValue ? "true button" : "false button"}
        </Button> */}
      </Grid>
    </>
  );
}

export default FieldsCreator;

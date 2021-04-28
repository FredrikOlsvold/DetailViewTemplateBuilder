import React, { useState } from "react";
import { TextField, Grid, Button, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
  listToObject,
} from "../../../../helpers/HelperMethods";
import { fieldTypes } from "../../../../api/getData";
import OptionsCreator from "../options/OptionsCreator";

function FieldsCreator({
  sectionUpdated,
  setSectionUpdated,
  setFieldList,
  fieldList,
  item,
  mode,
  deleteField,
}) {
  const [fieldType, setFieldType] = useState(item.Type);
  const [fieldValue, setFieldValue] = useState(item.Value);
  const [fieldFormat, setFieldFormat] = useState(item.Format);
  const [fieldLabel, setFieldLabel] = useState(item.Label);
  const [disabledValue, setDisabledValue] = useState(
    mode === "create" ? false : true
  );
  const index = fieldList.findIndex((fieldItem) => fieldItem === item);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [fieldOptionKey, setFieldOptionKey] = useState("");
  const [fieldOptionValue, setFieldOptionValue] = useState("");
  const [formatters, setFormatters] = useState([]);
  const [valueDescriptorPath, setValueDescriptorPath] = useState("");
  const [valueType, setValueType] = useState("");

  const onFieldOptionKeyChange = ({ target: { value } }) => {
    setFieldOptionKey(value);
  };
  const onFieldOptionValueChange = ({ target: { value } }) => {
    setFieldOptionValue(value);
  };
  const onFieldTypeChange = ({ target: { value } }) => {
    setFieldType(value);
  };
  const onFieldValueChange = ({ target: { value } }) => {
    setFieldValue(value);
  };
  const onFieldFormatChange = ({ target: { value } }) => {
    setFieldFormat(value);
  };
  const onLabelValueChange = ({ target: { value } }) => {
    setFieldLabel(value);
  };
  const onValueDescriptorPathChange = ({ target: { value } }) => {
      setValueDescriptorPath(value)
  }
  const onValueTypeChange = ({ target: { value } }) => {
    setValueType(value)
}

  const updateFields = () => {
      setFieldOptions([...fieldOptions, {Key: fieldOptionKey, Value: fieldOptionValue}])
    const newFieldList = replaceItemAtIndex(fieldList, index, {
      ...item,
      // id: uniqueGuid(),
      Type: fieldType,
      Value: fieldValue,
      Format: fieldFormat,
      Label: fieldLabel,
      Options: listToObject(fieldOptions),
      Formatters: formatters,
      ValueDescriptors: {
        Path: valueDescriptorPath,
        Type: valueType,
      },
    });

    setFieldList(newFieldList);
    setDisabledValue(!disabledValue);
    if (mode === "edit") {
      setSectionUpdated(!sectionUpdated);
    }
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
            select
            id={uniqueGuid()}
            disabled={disabledValue}
            label="Type"
            value={fieldType}
            variant="outlined"
            fullWidth
            onChange={onFieldTypeChange}
          >
            {Object.keys(fieldTypes).map((fType) => (
              <MenuItem key={fType} value={fType}>
                {fType}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
            {/* <OptionsCreator key={uniqueGuid() } /> */}
          <TextField
            id={uniqueGuid()}
            disabled={disabledValue}
            label="Label"
            value={fieldLabel}
            variant="outlined"
            fullWidth
            onChange={onLabelValueChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Option Key"
            value={fieldOptionKey}
            variant="outlined"
            fullWidth
            onChange={onFieldOptionKeyChange}
            //   error={error}
            //   helperText={error}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={disabledValue}
            id={uniqueGuid()}
            label="Option Value"
            value={fieldOptionValue}
            variant="outlined"
            fullWidth
            onChange={onFieldOptionValueChange}
            //   error={error}
            //   helperText={error}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            id={uniqueGuid()}
            disabled={disabledValue}
            label="Path"
            value={valueDescriptorPath}
            variant="outlined"
            fullWidth
            onChange={onValueDescriptorPathChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id={uniqueGuid()}
            disabled={disabledValue}
            label="Value Type" // What name??
            value={valueType}
            variant="outlined"
            fullWidth
            onChange={onValueTypeChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {mode === "create" && (
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
        )}

        {mode === "edit" && (
          <Grid item>
            <Button
              type="button"
              variant="contained"
              color="default"
              size="small"
              startIcon={disabledValue ? <EditIcon /> : <SaveIcon />}
              onClick={() => {
                if (disabledValue === true) {
                  setFieldType(fieldType);
                  setFieldValue(fieldValue);
                  setFieldFormat(fieldFormat);
                } else {
                  updateFields();
                }
                setDisabledValue(!disabledValue);
              }}
              style={{ marginBottom: "2em" }}
            >
              {disabledValue ? "Edit" : "Save"}
            </Button>
          </Grid>
        )}

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
      </Grid>
    </>
  );
}

export default FieldsCreator;

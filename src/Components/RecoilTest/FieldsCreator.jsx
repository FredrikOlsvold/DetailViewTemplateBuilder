import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

function FieldsCreator({setFieldList, fieldList}) {

    const [fieldId, setFieldId] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [fieldFormat, setFieldFormat] = useState("");

    const onFieldIdChange =({target: {value}}) => {setFieldId(value);};
    const onFieldTypeChange =({target: {value}}) => {setFieldType(value);};
    const onFieldValueChange =({target: {value}}) => {setFieldValue(value);};
    const onFieldFormatChange =({target: {value}}) => {setFieldFormat(value);};

    const addField = () => {


        setFieldList([...fieldList, 
            {
                id: getUniqueId(),
                text: {
                    id:fieldId, 
                    type:fieldType,
                    value:fieldValue,
                    format: fieldFormat,
                },
            }]);

        setFieldId("");
        setFieldType("");
        setFieldValue("");
        setFieldFormat("");
    };

  return (
    <>
    <Grid container spacing={1}>
        <Grid item xs={2}>
        <TextField
          id="fieldid"
          label="id"
          value={fieldId}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldIdChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="fieldtype"
          label="type"
          value={fieldType}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldTypeChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="fieldvalue"
          label="Value"
          value={fieldValue}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldValueChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="fieldformat"
          label="format"
          value={fieldFormat}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onFieldFormatChange}
        />
      </Grid>
      <Grid item xs={1}>
        <Button
          type="button"
          variant="contained"
          color="default"
          startIcon={<AddIcon />}
          onClick={addField}
        >
          FIELD
        </Button>
      </Grid>
    </Grid>
      
    </>
  );
}

let uniqueId = 0;
const getUniqueId = () => {
    return uniqueId++;
}


export default FieldsCreator;

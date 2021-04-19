import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { fieldFormDataAtom } from "../../../../store/atoms/Atoms";
import { WindowTitleDataAtom } from "../../../../store/atoms/WindowTitleAtom";
import { replaceItemAtIndex } from "../../../../utils/DataHandler";

function FieldForm() {
  const [selectedType, setSelectedType] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [formData, setFormData] = useState({});

  const [fieldFormData, setFieldFormData] = useRecoilState(fieldFormDataAtom);

  const handleSelectOnChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleLabelInputChange = (e) => {
    setFieldValue(e.target.value);
  };

  useEffect(() => {
    setFormData({
        id: 1,
      type: selectedType,
      value: fieldValue,
    });
  }, [selectedType, fieldValue]);

  const handleSaveFieldData = () => {

    const array = replaceItemAtIndex(fieldFormData, fieldFormData.findIndex(data => data.id === formData.id), formData);
      
      setFieldFormData(array)
        
  }

  return (
    <>
      <Grid item xs={6}>
        <TextField
          id="select"
          value={selectedType}
          variant="outlined"
          style={{ width: "100%" }}
          label="Field Type"
          select
          onChange={handleSelectOnChange}
        >
          {/* Map MenuItems based on type options accessible from data source 
            eg. data.types.map(t => {
            <MenuItem value={t.value}>{t.name}</MenuItem>

            })
          */}
          <MenuItem key="1" value="1">
            Type 1
          </MenuItem>
          <MenuItem key="2" value="2">
            Type 2
          </MenuItem>
          <MenuItem key="3" value="3">
            Type 3
          </MenuItem>
        </TextField>
        <TextField
          id="standard-basic"
          label="Field Value"
          variant="outlined"
          style={{ width: "100%" }}
          value={fieldValue}
          onChange={handleLabelInputChange}
        />
        <Button onClick={handleSaveFieldData}>Save field data</Button>
      </Grid>
    </>
  );
}

export default FieldForm;

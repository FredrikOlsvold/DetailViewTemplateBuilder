import { Grid, MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fieldFormDatasState } from "../../../App";

function FieldForm({ setFieldFormDatas, fieldFormDatas, fieldId }) {
  const [selectedType, setSelectedType] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [formData, setFormData] = useState({});
  const [formDatas, setFormDatas] = useRecoilState(fieldFormDatasState);

  const handleSelectOnChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleLabelInputChange = (e) => {
    setFieldLabel(e.target.value);
  };

  useEffect(() => {
    setFormData({
      id: fieldId,
      type: selectedType,
      label: fieldLabel,
    });
  }, [selectedType, fieldLabel]);

  useEffect(() => {
    // const updatedFormDatas = [...formDatas].map((data) => {
    //   if (data.id === formData.id) {
    //     console.log("UpdatedData");
    //     const updatedData = {
    //       ...data,
    //       id: formData.id,
    //       type: formData.type,
    //       label: formData.label,
    //     };
    //     return updatedData;
    //   } else {
    //     console.log("fromData");
    //     return formData;
    //   }
    // });

    //TODO: Make formDatas contain more than only one element.
    
    setFormDatas([...formDatas.map((data) => {
        if (data.id === formData.id) {
          console.log("UpdatedData");
          const updatedData = {
            ...data,
            id: formData.id,
            type: formData.type,
            label: formData.label,
          };
          return updatedData;
        } else {
          console.log("fromData");
          return formData;
        }
      })]);
  }, [formData]);

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
          label="Label"
          variant="outlined"
          style={{ width: "100%" }}
          value={fieldLabel}
          onChange={handleLabelInputChange}
        />
        {/* <Button onClick={saveForm}>Save</Button> */}
      </Grid>
    </>
  );
}

export default FieldForm;

import { MenuItem, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";

function FieldForm({setFieldFormDatas, fieldFormDatas}) {

    const [selectedType, setSelectedType] = useState("")
    const [fieldLabel, setFieldLabel] = useState("")
    const [formData, setFormData] = useState({})

    const handleSelectOnChange = (e) => {
        setSelectedType(e.target.value)
    }

    const handleLabelInputChange = (e) => {
        setFieldLabel(e.target.value)
    }

    useEffect(() => {
        setFormData({
            type: selectedType,
            label: fieldLabel
        })
    }, [selectedType, fieldLabel])

    useEffect(() => {
        setFieldFormDatas([...fieldFormDatas, formData])
    }, [formData])


  return (
    <>
      <TextField id="select" label="Field Type" select onChange={handleSelectOnChange}>
          {/* Map MenuItems based on type options accessible from data source 
            eg. data.types.map(t => {
            <MenuItem value={t.value}>{t.name}</MenuItem>

            })
          */}
        <MenuItem value="1">Type 1</MenuItem>
        <MenuItem value="2">Type 2</MenuItem>
        <MenuItem value="3">Type 3</MenuItem>
      </TextField>
      <TextField id="standard-basic" label="Label" onChange={handleLabelInputChange}/>
    </>
  );
}

export default FieldForm;

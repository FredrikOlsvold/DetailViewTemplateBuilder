import { Button, FormControl } from '@material-ui/core'
import React, { useState } from 'react'
import FieldForm from './Field/FieldForm'
import SectionForm from './Section/SectionForm'

function FormWrapper({setPreviewJson, previewJson}) {

    const [formList, setFormList] = useState([])
    const [fieldFormDatas, setFieldFormDatas] = useState([])


    const onAddFieldClick = () => {
        setFormList([...formList, <FieldForm setFieldFormDatas={setFieldFormDatas} fieldFormDatas={fieldFormDatas}/>])
    }

    const onPreviewJsonClick = () => {
        setPreviewJson(fieldFormDatas)
    }

    return (
        <div>
            <h1>Template Builder</h1>
            <FormControl>
                {/* <SectionForm /> */}
                
                {formList.map(f => {
                    return f
                })}
                <Button onClick={onAddFieldClick} >Add field</Button>
                <Button onClick={onPreviewJsonClick}>Preview Json</Button>
            </FormControl>
        </div>
    )
}

export default FormWrapper

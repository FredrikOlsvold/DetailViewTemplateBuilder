import { Button, FormControl } from '@material-ui/core'
import React, { useState } from 'react'
import FieldForm from './Field/FieldForm'
import SectionForm from './Section/SectionForm'

function FormWrapper() {

    const [formList, setFormList] = useState([])

    const onAddFieldClick = () => {
        setFormList([...formList, <FieldForm />])
    }

    return (
        <div>
            <h1>Template Builder</h1>
            <FormControl>
                {/* <SectionForm /> */}
                <Button onClick={onAddFieldClick} >Add field</Button>
                {formList.map(f => {
                    return f
                })}
                
            </FormControl>
        </div>
    )
}

export default FormWrapper

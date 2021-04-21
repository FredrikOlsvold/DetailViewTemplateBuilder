import React, { useState } from "react";
import {useSetRecoilState} from "recoil";
import {windowTitleAtom, contentAtom} from "../../Atoms/atoms";
import {Button, Grid, MenuItem, Paper, TextField, Typography} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import OptionsCreator from "../RecoilTest/OptionsCreator";
import FieldsCreator from "./FieldsCreator";
import {uniqueGuid} from "../../Helpers/HelperMethods";

const SectionItemCreator = ({wrapper}) => {
    const chosenAtom = (wrapper === "title") ? windowTitleAtom : contentAtom;
    const setSectionList = useSetRecoilState(chosenAtom);
    const [type, setType] = useState("");
    const [optionList, setOptionList] = useState([]);
    const [fieldList, setFieldList] = useState([]);


    const addSection = () => {
        setSectionList((oldSectionList) => [
            ...oldSectionList,
            {
                    id:uniqueGuid(),
                    type:type,
                    options:optionList,
                    fields:fieldList,
            },
        ]);
        setType("");
        setOptionList([]);
        setFieldList([]);
    }


    const addOptionClicked = () => {
        setOptionList((oldOptionList) => [
            ...oldOptionList,
            {
                    key: "",
                    value: "",
            },
        ]);
    }

    const addFieldClicked = () => {
        setFieldList((oldFieldList) => [
            ...oldFieldList,
            {
                    id: "",
                    type: "",
                    value: "",
                    format: "",
            },
        ]);
    }

    const onTypeChange =({target: {value}}) => {setType(value);};

    return(
        <>
        <div style={{padding:"2em"}}>
        <Grid container spacing={2}>

            <Grid item xs={3}>
               <TextField
                id="select"
                select
                value={type}
                label="Type"
                variant="outlined"
                style={{ width: "100%" }}
                onChange={onTypeChange}
                >
                <MenuItem value="" />
                <MenuItem value={1}>Type 1</MenuItem>
                <MenuItem value={2}>Type 2</MenuItem>
                <MenuItem value={3}>Type 3</MenuItem>
                <MenuItem value={4}>Type 4</MenuItem>
                <MenuItem value={5}>Type 5</MenuItem>
                <MenuItem value={6}>Type 6</MenuItem>
                <MenuItem value={7}>Type 7</MenuItem>
                <MenuItem value={8}>Type 8</MenuItem>
            </TextField> 
            </Grid>


        </Grid>

        </div>

        <div style={{ padding: "2em" }}>
            <Button style={{ marginRight: "1em" }} startIcon={<AddIcon />} variant="outlined" onClick={addFieldClicked}>ADD FIELD</Button>
                <Button startIcon={<AddIcon />} variant="outlined" onClick={addOptionClicked}>ADD OPTION</Button>
        </div>
                
        
        <div>
            {optionList.length > 0 && 
            <Paper style={{ padding: "2em", margin:"1em" }}>
                <Typography>Options:</Typography>
               {optionList.map((option, index) => (
                    <OptionsCreator key={index} item={option} setOptionList={setOptionList} optionList={optionList}/>
                ))} 
            </Paper>
            }
            
            
        </div>

        <div>
            {fieldList.length > 0 &&
            <Paper style={{ padding: "2em", margin:"1em" }}>
            <Typography>Fields:</Typography>
            {fieldList.map((field, index) => (
            <FieldsCreator key={index} item={field} setFieldList={setFieldList} fieldList={fieldList}/>
            ))} 
        </Paper>

            }

        </div>

        <div style={{ padding: "2em" }}>
        <Button color="primary" startIcon={<SaveIcon />} variant="contained" onClick={addSection}>ADD SECTION</Button>
        </div>
            
        </>
    )
};

let uniqueId = 0;
const getUniqueId = () => {
    return uniqueId++;
}
export default SectionItemCreator;
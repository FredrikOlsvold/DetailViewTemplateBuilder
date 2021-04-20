import React, { useState } from "react";
import {useSetRecoilState} from "recoil";
import {windowTitleAtom, contentAtom} from "../../Atoms/atoms";
import {Button, MenuItem, TextField} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import OptionsCreator from "../RecoilTest/OptionsCreator";
import FieldsCreator from "./FieldsCreator";

const SectionItemCreator = ({wrapper}) => {
    const chosenAtom = (wrapper === "title") ? windowTitleAtom : contentAtom;
    const setSectionList = useSetRecoilState(chosenAtom);
    const [sectionId, setSectionId] = useState("");
    const [type, setType] = useState("");
    const [optionList, setOptionList] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [optionCount, setOptionCount] = useState([]);
    const [fieldCount, setFieldCount] = useState([]);




    const addSection = () => {
        setSectionList((oldSectionList) => [
            ...oldSectionList,
            {
                id: getUniqueId(),
                text: {
                    id:sectionId,
                    type:type,
                    options:optionList,
                    fields:fieldList,
                },
            },
        ]);
        console.log(optionList);
        setSectionId("");
        setType("");
        setOptionList([]);
        setOptionCount([]);
        setFieldCount([]);
    }

    const addFieldClicked = () => {
        setFieldCount([...fieldCount, <FieldsCreator setFieldList={setFieldList} fieldList={fieldList}/>])
    };

    const addOptionClicked = () => {
        setOptionCount([...optionCount, <OptionsCreator setOptionList={setOptionList} optionList={optionList}/>])
    }


    const onValueChange =({target: {value}}) => {setSectionId(value);};
    const onTypeChange =({target: {value}}) => {setType(value);};




    return(
        <>
        <div>
            <TextField label="id" variant="outlined" type="text" value={sectionId} onChange={onValueChange}/>
            <TextField
                style={{ width: "10%" }}
                id="select"
                select
                value={type}
                label="Type"
                variant="outlined"
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
            <Button startIcon={<AddIcon />} variant="outlined" onClick={addFieldClicked}>ADD FIELD</Button>
            <Button startIcon={<AddIcon />} variant="outlined" onClick={addOptionClicked}>ADD OPTION</Button>
            <Button startIcon={<SaveIcon />} variant="outlined" onClick={addSection}>SAVE</Button>

        </div>
        <div>
            {optionCount.map((option, index) => (
                <OptionsCreator key={index} setOptionList={setOptionList} optionList={optionList}/>
            ))}
        </div>

        <div>
        {fieldCount.map((field, index) => (
                <FieldsCreator key={index} setFieldList={setFieldList} fieldList={fieldList}/>
            ))}
        </div>
            
        </>
    )
};

let uniqueId = 0;
const getUniqueId = () => {
    return uniqueId++;
}
export default SectionItemCreator;
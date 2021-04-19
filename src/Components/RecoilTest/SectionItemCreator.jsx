import React, { useState } from "react";
import {useSetRecoilState} from "recoil";
import {fieldListAtom} from "../../App";
import {Button, TextField} from "@material-ui/core";
import { Add } from "@material-ui/icons";

const SectionItemCreator = () => {
    const setSectionList = useSetRecoilState(fieldListAtom);
    const [sectionValue, setSectionValue] = useState("");
    const [sectionType, setSectionType] = useState("");
    const [sectionFormat, setSectionFormat] = useState("");



    const addSection = () => {
        setSectionList((oldSectionList) => [
            ...oldSectionList,
            {
                id: getUniqueId(),
                text: {
                    value:sectionValue,
                    type:sectionType,
                    format:sectionFormat,
                },
            },
        ]);

        setSectionType("");
        setSectionValue("");
        setSectionFormat("");
    }


    const onValueChange =({target: {value}}) => {setSectionValue(value);};
    const onTypeChange =({target: {value}}) => {setSectionType(value);};
    const onFormatChange =({target: {value}}) => {setSectionFormat(value);};



    return(
        <div>
            <TextField label="value" variant="outlined" type="text" value={sectionValue} onChange={onValueChange}/>
            <TextField label ="type" variant="outlined" type="text" value={sectionType} onChange={onTypeChange}/>
            <TextField label ="format" variant="outlined" type="text" value={sectionFormat} onChange={onFormatChange}/>
            <Button startIcon={<Add />} variant="outlined" onClick={addSection}>Add</Button>
        </div>

    )
};

let uniqueId = 0;
const getUniqueId = () => {
    console.log("ID:", uniqueId);
    return uniqueId++;
}
export default SectionItemCreator;
import {useRecoilState} from "recoil";
import {fieldListAtom} from "../../App";
import {Button, TextField} from "@material-ui/core";
import React, { useState } from "react";

const SectionItem = ({item}) => {
    const [sectionList, setSectionList] = useRecoilState(fieldListAtom);
    const index = sectionList.findIndex((sectionItem) => sectionItem === item);
    const [sectionValue, setSectionValue] = useState(item.text.value);
    const [sectionType, setSectionType] = useState(item.text.type);
    const [sectionFormat, setSectionFormat] = useState(item.text.format);
    const [sectionUpdated, setSectionUpdated] = useState(false);



    const deleteSection = () => {
        const newSectionList = removeItemAtIndex(sectionList, index);
        setSectionList(newSectionList);
    };

    const updateSection = () => {
        setSectionUpdated(false);
        const newSectionList = replaceItemAtIndex(sectionList, index, {
            ...item,
            text: {
                value:sectionValue,
                type:sectionType,
                format:sectionFormat,
            },
        });

        setSectionList(newSectionList);
    };

    const onValueChange =({target: {value}}) => {
        setSectionValue(value);
        setSectionUpdated(true);
    };

    const onTypeChange =({target: {value}}) => {
        setSectionType(value);
        setSectionUpdated(true);
    };

    const onFormatChange =({target: {value}}) => {
        setSectionFormat(value);
        setSectionUpdated(true);
    };


    return(
        <div>
            <TextField variant="outlined" type="text" value={sectionValue} onChange={onValueChange}/>
            <TextField variant="outlined" type="text" value={sectionType} onChange={onTypeChange}/>
            <TextField variant="outlined" type="text" value={sectionFormat} onChange={onFormatChange}/>
            {sectionUpdated && <Button variant="outlined" onClick={updateSection}>UPDATE</Button>}
            
            <Button variant="outlined" onClick={deleteSection}>DELETE</Button>

        </div>

    )
}


//Copied directly from recoil
function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};
//Copied directly from recoil
function removeItemAtIndex(arr, index) {
return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

export default SectionItem;


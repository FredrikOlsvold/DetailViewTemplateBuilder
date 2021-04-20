import {useRecoilState} from "recoil";
import {Button, MenuItem, TextField} from "@material-ui/core";
import React, { useState } from "react";
import {windowTitleAtom, contentAtom} from "../../Atoms/atoms";

const SectionItem = ({item, wrapper}) => {

    const chosenAtom = (wrapper === "title") ? windowTitleAtom : contentAtom;
    const [sectionList, setSectionList] = useRecoilState(chosenAtom);
    const index = sectionList.findIndex((sectionItem) => sectionItem === item);
    const [sectionId, setSectionId] = useState(item.text.id);
    const [sectionUpdated, setSectionUpdated] = useState(false);
    const [type, setType] = useState(item.text.type);



    const deleteSection = () => {
        const newSectionList = removeItemAtIndex(sectionList, index);
        setSectionList(newSectionList);
    };

    const updateSection = () => {
        setSectionUpdated(false);
        const newSectionList = replaceItemAtIndex(sectionList, index, {
            ...item,
            text: {
                id:sectionId,
                type:type,
                options: [],
            },
        });

        setSectionList(newSectionList);
    };

    const onValueChange =({target: {value}}) => {
        setSectionId(value);
        setSectionUpdated(true);
    };

    const onTypeChange =({target: {value}}) => {
        setType(value);
        setSectionUpdated(true);
    };


    return(
        <div>
            <TextField variant="outlined" type="text" value={sectionId} onChange={onValueChange}/>
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


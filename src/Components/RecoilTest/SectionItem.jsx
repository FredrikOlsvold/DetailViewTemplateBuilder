import { useRecoilState } from "recoil";
import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { windowTitleAtom, contentAtom } from "../../Atoms/atoms";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
} from "../../Helpers/HelperMethods";
import OptionsCreator from "./OptionsCreator";

const SectionItem = ({ item, wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const [sectionList, setSectionList] = useRecoilState(chosenAtom);
  const index = sectionList.findIndex((sectionItem) => sectionItem === item);

  const [sectionUpdated, setSectionUpdated] = useState(false);
  const [type, setType] = useState(item.type);
  const [fields, setFields] = useState(item.fields);
  const [optionList, setOptionList] = useState(item.options);

  const deleteSection = () => {
    const newSectionList = removeItemAtIndex(sectionList, index);
    setSectionList(newSectionList);
  };

  const deleteOption = () => {
    setSectionUpdated(true);
    
    // updateSection();
  };

  const updateSection = () => {
    setSectionUpdated(false);
    const newSectionList = replaceItemAtIndex(sectionList, index, {
      ...item,
      id: item.id,
      type: type,
      options: optionList,
      fields: fields,
    });

    setSectionList(newSectionList);
  };

  const onTypeChange = ({ target: { value } }) => {
    setType(value);
    setSectionUpdated(true);
  };

  return (
    <div>
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

      {sectionUpdated && (
        <Button variant="outlined" onClick={updateSection}>
          UPDATE
        </Button>
      )}

      <Button variant="outlined" onClick={deleteSection}>
        DELETE
      </Button>

      {/* Mappa ut fields og options */}
      {optionList.map((option) => (
        <OptionsCreator
          key={getUniqueId()}
          item={option}
          mode={mode}
          wrapper={wrapper}
          optionList={optionList}
          setOptionList={setOptionList}
          deleteOption={deleteOption}
        />
      ))}
    </div>
  );
};

let uniqueId = 0;
const getUniqueId = () => {
  console.log(uniqueId);
  return uniqueId++;
};

export default SectionItem;

import { useRecoilState } from "recoil";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { windowTitleAtom, contentAtom } from "../../Atoms/atoms";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  uniqueGuid,
} from "../../Helpers/HelperMethods";
import OptionsCreator from "./OptionsCreator";
import { ExpandMore } from "@material-ui/icons";

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
  console.log(optionList.map((op) => op.options));
  console.log(sectionList.map((op) => op.options));

  return (
    <div style={{ padding: "2em" }}>
      <Accordion
        style={{ padding: "2em", margin: "1em" }}
        defaultExpanded={false}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Type: {type}</Typography>
        </AccordionSummary>

        <AccordionDetails>
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
        </AccordionDetails>

        <AccordionActions>
          {sectionUpdated && (
            <Button variant="outlined" onClick={updateSection}>
              UPDATE
            </Button>
          )}

          <Button variant="outlined" onClick={deleteSection}>
            DELETE
          </Button>
        </AccordionActions>

        <Grid item>
          <AccordionDetails>
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
          </AccordionDetails>
        </Grid>
      </Accordion>
    </div>
  );
};

let uniqueId = 0;
const getUniqueId = () => {
  console.log(uniqueId);
  return uniqueId++;
};

export default SectionItem;

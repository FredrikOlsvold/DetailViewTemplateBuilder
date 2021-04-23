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
import React, { useEffect, useState } from "react";
import { windowTitleAtom, contentAtom } from "../../../store/Store";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
} from "../../../helpers/HelperMethods";
import OptionsCreator from "../creator/options/OptionsCreator";
import FieldsCreator from "../creator/field/FieldsCreator";
import { ExpandMore } from "@material-ui/icons";

const SectionItemEditor = ({ item, wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const [sectionList, setSectionList] = useRecoilState(chosenAtom);
  const index = sectionList.findIndex((sectionItem) => sectionItem === item);

  const [sectionUpdated, setSectionUpdated] = useState(false);
  const [type, setType] = useState(item.Type);
  const [optionList, setOptionList] = useState(item.Options);
  const [fieldList, setFieldList] = useState(item.Fields);

  const deleteSection = () => {
    const newSectionList = removeItemAtIndex(sectionList, index);
    setSectionList(newSectionList);
  };

  const deleteOption = () => {
    setSectionUpdated(true);
  };

  const deleteField = () => {
    setSectionUpdated(true);
  };

  const updateSection = () => {
    setSectionUpdated(false);
    const newSectionList = replaceItemAtIndex(sectionList, index, {
      ...item,
      Id: item.Id,
      Type: type,
      Options: optionList,
      Fields: fieldList,
    });

    setSectionList(newSectionList);
  };

  const onTypeChange = ({ target: { value } }) => {
    setType(value);
    setSectionUpdated(true);
  };
  
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
            {/* Mappa ut options */}
            {optionList.map((option) => (
              <OptionsCreator
                key={getUniqueId()}
                item={option}
                mode={mode}
                setSectionUpdated={setSectionUpdated}
                sectionUpdated={sectionUpdated}
                optionList={optionList}
                setOptionList={setOptionList}
                deleteOption={deleteOption}
              />
            ))}
          </AccordionDetails>
        </Grid>

        <Grid item>
          <AccordionDetails>
            {/* Mappa ut fields */}
            {fieldList.map((field) => (
              <FieldsCreator
                key={getUniqueId()}
                item={field}
                mode={mode}
                fieldList={fieldList}
                setFieldList={setFieldList}
                deleteField={deleteField}
                setSectionUpdated={setSectionUpdated}
                sectionUpdated={sectionUpdated}
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
  return uniqueId++;
};

export default SectionItemEditor;

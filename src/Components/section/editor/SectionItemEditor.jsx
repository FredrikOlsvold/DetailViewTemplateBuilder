import { useRecoilState } from "recoil";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import { windowTitleAtom, contentAtom } from "../../../store/Store";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
} from "../../../helpers/HelperMethods";
import OptionsCreator from "../creator/options/OptionsCreator";
import FieldsCreator from "../creator/field/FieldsCreator";
import { ExpandMore } from "@material-ui/icons";
import MenuTypes from "../creator/MenuTypes";

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
          <MenuTypes
            id="select"
            select
            value={type}
            label="Type"
            variant="outlined"
            style={{ width: "100%" }}
            onChange={onTypeChange}
          />
        </AccordionDetails>

        <AccordionActions>
          <Button variant="outlined" onClick={deleteSection}>
            DELETE
          </Button>
        </AccordionActions>

        <Grid item>
          <AccordionDetails>
            {/* Mappa ut options */}
            {optionList.length > 0 && <Typography>Options:</Typography>}
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
            {fieldList.length > 0 && <Typography>Fields:</Typography>}
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
        <AccordionActions>
          {sectionUpdated && (
            <Button
              color="primary"
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={updateSection}
            >
              Save changes
            </Button>
          )}
        </AccordionActions>
      </Accordion>
    </div>
  );
};

let uniqueId = 0;
const getUniqueId = () => {
  return uniqueId++;
};

export default SectionItemEditor;

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
import SaveIcon from "@material-ui/icons/Save";
import React, { useEffect, useState } from "react";
import { windowTitleAtom, contentAtom } from "../../../store/Store";
import {
  replaceItemAtIndex,
  removeItemAtIndex,
  objectToList,
  listToObject,
  uniqueGuid,
} from "../../../helpers/HelperMethods";
import OptionsCreator from "../creator/options/OptionsCreator";
import FieldsCreator from "../creator/field/FieldsCreator";
import { ExpandMore } from "@material-ui/icons";
import MenuTypes from "../creator/MenuTypes";
import { sectionTypes } from "../../../api/getData";
import AddIcon from "@material-ui/icons/Add";

const SectionItemEditor = ({ item, wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const [sectionList, setSectionList] = useRecoilState(chosenAtom);
  const index = sectionList.findIndex((sectionItem) => sectionItem === item);

  const [sectionUpdated, setSectionUpdated] = useState(false);
  const [sectionType, setSectionType] = useState(item.Type);
  const [optionList, setOptionList] = useState(objectToList(item.Options));
  const [fieldList, setFieldList] = useState(item.Fields);

  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Item is updated");
    setOptionList(objectToList(item.Options));
    setFieldList(item.Fields);
  }, [item]);

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

  const addOptionClicked = () => {
    setOptionList((oldOptionList) => [
      ...oldOptionList,
      {
        Id: uniqueGuid(),
        Key: "",
        Value: "",
      },
    ]);
  };

  const addFieldClicked = () => {
    setFieldList((oldFieldList) => [
      ...oldFieldList,
      {
        Id: uniqueGuid(),
        Type: "",
        Value: "",
        Format: "",
        Label: "",
      },
    ]);
  };

  const updateSection = () => {
    if (sectionType !== "") {
      setSectionUpdated(false);
      const newSectionList = replaceItemAtIndex(sectionList, index, {
        ...item,
        Id: item.Id,
        Type: sectionType,
        Options: listToObject(optionList),
        Fields: fieldList,
      });

      setSectionList(newSectionList);
      setError("")
      return;
    }

    setError("Requred field!")

  };

  const onTypeChange = ({ target: { value } }) => {
    setSectionType(value);
    setSectionUpdated(true);
    setError("");
  };

  return (
    <div style={{ padding: "2em" }}>
      <Accordion
        style={{ padding: "2em", margin: "1em" }}
        defaultExpanded={false}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Type: {sectionType}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <TextField
            error={error}
            required
            helperText={error}
            id="select"
            select
            value={sectionType}
            label="Type"
            variant="outlined"
            style={{ width: "100%" }}
            onChange={onTypeChange}
          >
            {sectionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          {/* <MenuTypes
            id="select"
            select
            value={type}
            label="Type"
            variant="outlined"
            style={{ width: "100%" }}
            onChange={onTypeChange}
          /> */}
        </AccordionDetails>

        <AccordionActions>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addFieldClicked}
          >
            Add Field
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addOptionClicked}
          >
            Add Option
          </Button>

          <Button variant="outlined" onClick={deleteSection}>
            DELETE
          </Button>
        </AccordionActions>

        <Grid item>
          {/* <AccordionDetails> */}
          {/* Mappa ut options */}
          {optionList.length > 0 && <Typography>Options:</Typography>}
          {optionList.map((option) => (
            <OptionsCreator
              key={option.key}
              item={option}
              mode={mode}
              setSectionUpdated={setSectionUpdated}
              sectionUpdated={sectionUpdated}
              optionList={optionList}
              setOptionList={setOptionList}
              deleteOption={deleteOption}
            />
          ))}
          {/* </AccordionDetails> */}
        </Grid>

        <Grid item>
          {/* <AccordionDetails> */}
          {/* Mappa ut fields */}
          {fieldList.length > 0 && <Typography>Fields:</Typography>}
          {fieldList.map((field) => (
            <FieldsCreator
              key={field.Id}
              item={field}
              mode={mode}
              fieldList={fieldList}
              setFieldList={setFieldList}
              deleteField={deleteField}
              setSectionUpdated={setSectionUpdated}
              sectionUpdated={sectionUpdated}
            />
          ))}
          {/* </AccordionDetails> */}
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

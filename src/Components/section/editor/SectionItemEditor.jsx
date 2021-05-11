import { useRecoilState, useSetRecoilState } from "recoil";
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
import {
  windowTitleAtom,
  contentAtom,
  displayWrapperAtom,
} from "../../../store/Store";
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
import { sectionTypes } from "../../../api/getData";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SectionItemEditor = ({ item, wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const [sectionList, setSectionList] = useRecoilState(chosenAtom);
  const index = sectionList.findIndex((sectionItem) => sectionItem === item);

  const [sectionUpdated, setSectionUpdated] = useState(false);
  const [sectionType, setSectionType] = useState(item.Type);
  const [optionList, setOptionList] = useState(objectToList(item.Options));
  const [fieldList, setFieldList] = useState(item.Fields);

  const [error, setError] = useState("");

  const [expandedOption, setExpandedOption] = useState(false);
  const [expandedField, setExpandedField] = useState(false);
  
  // useEffect(() => {
  //   console.log("Item is updated");
  //   setOptionList(objectToList(item.Options));
  //   setFieldList(item.Fields);
  // }, [item]);

  const handleOnDragEndFields = (res) => {
    const fields = Array.from(fieldList);
    const [reorderedField] = fields.splice(res.source.index, 1);
    fields.splice(res.destination.index, 0, reorderedField);

    setFieldList(fields);
  };

  const handleOptionsAccordionChange = () => {
    setExpandedOption((open) => !open);
  };

  const handleFieldsAccordionChange = () => {
      setExpandedField((open) => !open)
  }

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
      setExpandedOption(true)
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
    setExpandedField(true)
    setFieldList((oldFieldList) => [
      ...oldFieldList,
      {
        Id: uniqueGuid(),
        Type: "",
        Label: "",
        Options: {},
        Formatters: [],
        ValueDescriptor: {},
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
      setError("");
      return;
    }

    setError("Required field!");
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
          <Typography>Type: {sectionType}. ID: _{item.Id}</Typography>
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
            {Object.keys(sectionTypes).map((type) => (
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

        <Grid container direction={"column"} spacing={4}>
          <Grid item>
            {" "}
            {/* Option Accordion */}
            {optionList.length > 0 && (
              <Accordion
                expanded={expandedOption} onChange={handleOptionsAccordionChange}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Options:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction={"row"} spacing={4}>
                    {optionList.map((option, index) => (
                      <Grid item>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>
                              {option.Key} : {option.Id}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <OptionsCreator
                              key={option.Key + option.Value}
                              item={option}
                              mode={mode}
                              setSectionUpdated={setSectionUpdated}
                              sectionUpdated={sectionUpdated}
                              optionList={optionList}
                              setOptionList={setOptionList}
                              deleteOption={deleteOption}
                              optionOrigin={"sectionOptionOrigin"}
                            />
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </Grid>
          <Grid item>
            {" "}
            {/* Field Accordion */}
            {fieldList.length > 0 && (
              <Accordion expanded={expandedField} onChange={handleFieldsAccordionChange}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Fields:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction={"row"} spacing={4}>
                    <DragDropContext onDragEnd={handleOnDragEndFields}>
                      <Droppable droppableId={"fieldsDragAndDrop"}>
                        {(provided) => (
                          <ul
                            className="dndList"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {fieldList.map((field, index) => (
                              <Draggable
                                key={field.Id}
                                draggableId={field.Id}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <Grid item xs={12} style={{marginBottom: "1em"}}>
                                      <Accordion>
                                        <AccordionSummary
                                          expandIcon={<ExpandMore />}
                                        >
                                          <Typography>
                                            {field.Type} : {field.Id}
                                          </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <FieldsCreator
                                            key={field.Id}
                                            item={field}
                                            mode={mode}
                                            fieldList={fieldList}
                                            setFieldList={setFieldList}
                                            deleteField={deleteField}
                                            setSectionUpdated={
                                              setSectionUpdated
                                            }
                                            sectionUpdated={sectionUpdated}
                                          />
                                        </AccordionDetails>
                                      </Accordion>
                                    </Grid>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </Grid>
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

export default SectionItemEditor;

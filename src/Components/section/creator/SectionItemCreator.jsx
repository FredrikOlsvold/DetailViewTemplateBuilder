import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { windowTitleAtom, contentAtom } from "../../../store/Store";
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import OptionsCreator from "./options/OptionsCreator";
import FieldsCreator from "./field/FieldsCreator";
import { uniqueGuid, listToObject, objectToList } from "../../../helpers/HelperMethods";
import MenuTypes from "./MenuTypes";
import { sectionTypes } from "../../../api/getData";

const SectionItemCreator = ({ wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const setSectionList = useSetRecoilState(chosenAtom);
  const [sectionType, setSectionType] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [fieldList, setFieldList] = useState([]);

  const [error, setError] = useState("");

  const addSection = () => {
    if (sectionType !== "") {
      setSectionList((oldSectionList) => [
        ...oldSectionList,
        {
          Id: uniqueGuid(),
          Type: sectionType,
          Options: listToObject(optionList),
          Fields: fieldList,
        },
      ]);
      setSectionType("");
      setOptionList([]);
      setFieldList([]);
    }

    setError("Required field!");
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

  const onTypeChange = ({ target: { value } }) => {
    setSectionType(value);
    setError("");
  };

  return (
    <>
      <div style={{ padding: "2em" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="select"
              select
              value={sectionType}
              label="Type"
              variant="outlined"
              style={{ width: "100%" }}
              onChange={onTypeChange}
            >
              {sectionTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </div>

      <div style={{ padding: "2em" }}>
        <Button
          style={{ marginRight: "1em" }}
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addFieldClicked}
        >
          ADD FIELD
        </Button>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addOptionClicked}
        >
          ADD OPTION
        </Button>
      </div>

      <div>
        {optionList.length > 0 && (
          <Paper style={{ padding: "2em", margin: "1em" }}>
            <Typography>Options:</Typography>
            {optionList.map((option) => (
              <OptionsCreator
                key={option.Id}
                item={option}
                setOptionList={setOptionList}
                optionList={optionList}
                mode={mode}
                wrapper={wrapper}
              />
            ))}
          </Paper>
        )}
      </div>

      <div>
        {fieldList.length > 0 && (
          <Paper style={{ padding: "2em", margin: "1em" }}>
            <Typography>Fields:</Typography>
            {fieldList.map((field) => (
              <FieldsCreator
                key={field.id}
                item={field}
                setFieldList={setFieldList}
                fieldList={fieldList}
                mode={mode}
              />
            ))}
          </Paper>
        )}
      </div>

      <div style={{ padding: "2em" }}>
        <Button
          color="primary"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={addSection}
        >
          ADD SECTION
        </Button>
      </div>
    </>
  );
};

export default SectionItemCreator;

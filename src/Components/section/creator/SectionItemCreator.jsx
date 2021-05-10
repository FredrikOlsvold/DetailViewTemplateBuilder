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
import { uniqueGuid, listToObject, formatFormatList } from "../../../helpers/HelperMethods";
import { sectionTypes } from "../../../api/getData";
import ValueDescriptor from "./valueDescriptor/ValueDescriptor";
import FormatCreator from "./format/FormatCreator";

const SectionItemCreator = ({ wrapper, mode }) => {
  const chosenAtom = wrapper === "title" ? windowTitleAtom : contentAtom;
  const setSectionList = useSetRecoilState(chosenAtom);
  const [sectionType, setSectionType] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [fieldList, setFieldList] = useState([]);
  const [sectionValueDescriptor, setSectionValueDescriptor] = useState({});
  const [sectionFormatters, setSectionFormatters] = useState([]);
  const [sectionValueDescriptorPath, setSectionValueDescriptorPath] = useState(
    ""
  );
  const [sectionValueDescriptorType, setSectionValueDescriptorType] = useState(
    ""
  );

  const updateValueDescriptor = () => {
    setSectionValueDescriptor({
          Path: sectionValueDescriptorPath,
          Type: sectionValueDescriptorType,
      })
  }

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
          ValueDescriptor: sectionValueDescriptor,
          Formatters: formatFormatList(sectionFormatters),
        },
      ]);
      setSectionType("");
      setOptionList([]);
      setFieldList([]);
      setError("");
      setSectionValueDescriptor({});
      setSectionFormatters([]);
      return;
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
        Label: "",
        Options: [],
        Formatters: [],
        ValueDescriptor: {},
      },
    ]);
  };

  const addFormattersClicked = () => {
    setSectionFormatters((oldSectionFormattersList) => [
      ...oldSectionFormattersList,
      {
        Id: uniqueGuid(),
        Key: "",
        Value: "",
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
          </Grid>
        </Grid>
      </div>
      <div>
        <ValueDescriptor
          setSectionValueDescriptor={setSectionValueDescriptor}
          sectionValueDescriptorPath={sectionValueDescriptorPath}
          setSectionValueDescriptorPath={setSectionValueDescriptorPath}
          sectionValueDescriptorType={sectionValueDescriptorType}
          setSectionValueDescriptorType={setSectionValueDescriptorType}
          updateValueDescriptor={updateValueDescriptor}
        />
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
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addFormattersClicked}
        >
          ADD FORMATTERS
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

      <div>
        {sectionFormatters.length > 0 && (
          <Paper style={{ padding: "2em", margin: "1em" }}>
            <Typography>Format:</Typography>
            {sectionFormatters.map((format) => (
              <FormatCreator
                key={format.Id}
                item={format}
                setFormatters={setSectionFormatters}
                formatters={sectionFormatters}
                valueType={sectionValueDescriptorType}
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

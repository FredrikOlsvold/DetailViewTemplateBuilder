import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import FieldForm from "./Field/FieldForm";
import SectionForm from "./Section/SectionForm";
import { fieldFormListState, fieldFormDatasState } from "../../App";

function FormWrapper({ setPreviewJson, previewJson }) {
  const fieldFormData = useRecoilValue(fieldFormDatasState);
  const formList = useRecoilValue(fieldFormListState);
  const setFormList = useSetRecoilState(fieldFormListState);

  //const [fieldFormDatas, setFieldFormDatas] = useState([]);

  const onAddFieldClick = () => {
    setFormList([
      ...formList,
      {
        key: formList.length.toString(),
        value: <FieldForm key={formList.length.toString()} fieldId={formList.length.toString()} />
      },
    ]);
  };

  const onPreviewJsonClick = () => {};

  return (
    <div>
      <h1>Template Builder</h1>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <Grid container spacing={3}>
              <SectionForm />
              {formList.map((f) => {
                return f.value;
              })}
              <Button onClick={onAddFieldClick}>Add field</Button>
              <Button onClick={onPreviewJsonClick}>Preview Json</Button>
            </Grid>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* <FormControl> */}

      {/* </FormControl> */}
    </div>
  );
}

function getKey() {
  return 1;
}

export default FormWrapper;

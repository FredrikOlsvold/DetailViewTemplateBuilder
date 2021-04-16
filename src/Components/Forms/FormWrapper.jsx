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
import FieldForm from "./Field/FieldForm";
import SectionForm from "./Section/SectionForm";

function FormWrapper({ setPreviewJson, previewJson }) {
  const [formList, setFormList] = useState([]);
  const [fieldFormDatas, setFieldFormDatas] = useState([]);

  const onAddFieldClick = () => {
    setFormList([
      ...formList,
      <FieldForm
        setFieldFormDatas={setFieldFormDatas}
        fieldFormDatas={fieldFormDatas}
      />,
    ]);
  };

  const onPreviewJsonClick = () => {
    setPreviewJson(fieldFormDatas);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <Grid container spacing={3}>
              <SectionForm />
              {formList.map((f) => {
                return f;
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

export default FormWrapper;

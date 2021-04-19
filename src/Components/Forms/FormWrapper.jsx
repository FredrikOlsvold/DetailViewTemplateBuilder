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
import FieldForm from "./Section/Field/FieldForm";

function FormWrapper(props) {
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

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          {props.section === "title" ? (
            <Typography>Title</Typography>
          ) : (
            <Typography>Content</Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <Grid container spacing={3}>
              {props.children}
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

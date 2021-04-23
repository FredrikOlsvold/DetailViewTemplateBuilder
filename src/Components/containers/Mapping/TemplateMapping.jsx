import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  AccordionActions,
} from "@material-ui/core";
import { Delete, ExpandMore } from "@material-ui/icons";
import SaveIcon from "@material-ui/icons/Save";
import {
  scopeOptions,
  dataItemTypeOptions,
  sourceDataTypeOptions,
} from "../../../api/getData";

const TemplateMapping = () => {
  const [scope, setScope] = useState("");
  const [sourceDataType, setSourceDataType] = useState("");
  const [dataItemType, setDataItemType] = useState("");
  const [templateName, setTemplateName] = useState("");

  const onMappingComplete = () => {
    console.log(`Scope: ${scope}`);
    console.log(`Source Data Type: ${sourceDataType}`);
    console.log(`Data Item Type: ${dataItemType}`);
    console.log(`Template Name: ${templateName}`);
  };

  const onScopeChanged = (event) => setScope(event.target.value);
  const onSourceDataTypeChanged = (event) =>
    setSourceDataType(event.target.value);
  const onDataItemTypeChanged = (event) => setDataItemType(event.target.value);
  const onTemplateNameChanged = (event) => setTemplateName(event.target.value);

  return (
    <>
      <Accordion style={{ padding: "2em", margin: "1em" }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Name and Mapping</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                id="selectTemplateName"
                label="Name"
                variant="outlined"
                onChange={onTemplateNameChanged}
                value={templateName}
                fullWidth
              ></TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                id="selectDataItemType"
                select
                label="DataItemType"
                variant="outlined"
                value={dataItemType}
                onChange={onDataItemTypeChanged}
                fullWidth
              >
                {dataItemTypeOptions.map((dataItem) => (
                  <MenuItem key={dataItem.key} value={dataItem.value}>
                    {dataItem.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                id="selectScope"
                select
                label="Scope"
                value={scope}
                variant="outlined"
                onChange={onScopeChanged}
                fullWidth
              >
                {scopeOptions.map((scope) => (
                  <MenuItem key={scope.key} value={scope.value}>
                    {scope.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                id="selectSourceDataType"
                select
                label="SourceDataType"
                value={sourceDataType}
                variant="outlined"
                onChange={onSourceDataTypeChanged}
                fullWidth
              >
                {sourceDataTypeOptions.map((sourceData) => (
                  <MenuItem key={sourceData.key} value={sourceData.value}>
                    {sourceData.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionDetails>
          <AccordionActions>
            <Button
              type="button"
              variant="contained"
              onClick={onMappingComplete}
              startIcon={<SaveIcon />}
            >
              SAVE
            </Button>

            <Button type="button" variant="contained" startIcon={<Delete />}>
              DELETE
            </Button>
          </AccordionActions>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default TemplateMapping;

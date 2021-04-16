import React, { useState } from "react";
import { Button, TextField, MenuItem, Grid } from '@material-ui/core'
import { Delete } from "@material-ui/icons";
import SaveIcon from '@material-ui/icons/Save';
import {scopeOptions, dataItemTypeOptions, sourceDataTypeOptions} from "../../../api/getData"

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

    const onScopeChanged = event => setScope(event.target.value);
    const onSourceDataTypeChanged = event => setSourceDataType(event.target.value);
    const onDataItemTypeChanged = event => setDataItemType(event.target.value);
    const onTemplateNameChanged = event => setTemplateName(event.target.value);


    return(
            <>
            <Grid container spacing={2}>
                
                <Grid item xs={4}>
                    <TextField
                        id="selectTemplateName"
                        label="Name"
                        variant="outlined"
                        onChange={onTemplateNameChanged}
                        value={templateName}
                        style={{ width: "100%" }}>                           
                    </TextField>
                    </Grid>

                    <Grid item xs={4}>
                    <TextField
                        id="selectDataItemType"
                        select
                        label="DataItemType"
                        variant="outlined"
                        value={dataItemType}
                        onChange={onDataItemTypeChanged}
                        style={{ width: "100%" }}>
                            {dataItemTypeOptions.map((dataItem) => (
                                <MenuItem key={dataItem.key} value={dataItem.value}>{dataItem.value}</MenuItem>
                            ))}
                    </TextField>
                    </Grid>  
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                    <TextField
                        id="selectScope"
                        select
                        label="Scope"
                        value={scope}
                        variant="outlined"
                        onChange={onScopeChanged}
                        style={{ width: "100%" }}>
                            {scopeOptions.map((scope) => (
                                <MenuItem key={scope.key} value={scope.value}>{scope.value}</MenuItem>
                            ))}
                    </TextField>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                        id="selectSourceDataType"
                        select
                        label="SourceDataType"
                        value={sourceDataType}
                        variant="outlined"
                        onChange={onSourceDataTypeChanged}
                        style={{ width: "100%" }}>
                                {sourceDataTypeOptions.map((sourceData) => (
                                <MenuItem key={sourceData.key} value={sourceData.value}>{sourceData.value}</MenuItem>
                            ))}
                    </TextField>
                    </Grid>
                </Grid>




            <Button
            type="button" 
            variant="contained"
            onClick={onMappingComplete}
            startIcon={<SaveIcon />}>SAVE</Button>

            <Button
            type="button"
            variant="contained"
            startIcon={<Delete />}>DELETE</Button>

            </>
    )

};

export default TemplateMapping;
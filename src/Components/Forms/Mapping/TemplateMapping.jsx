import React, { useState } from "react";
import { Button, TextField, MenuItem } from '@material-ui/core'
import {scopeOptions, dataItemTypeOptions, sourceDataTypeOptions} from "../../../api/getData"

const TemplateMapping = () => {

    const [scope, setScope] = useState("");
    const [sourceDataType, setSourceDataType] = useState("");
    const [dataItemType, setDataItemType] = useState("");
    const [templateName, setTemplateName] = useState("new_template_name");

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
            <form>
                <h3>Template Mapping</h3>
                <div>
                    <TextField
                        id="selectTemplateName"
                        label="name"
                        onChange={onTemplateNameChanged}
                        helperText="Please select a template name"
                        defaultValue = "">                           
                    </TextField>

                    <TextField
                        id="selectDataItemType"
                        select
                        label="DataSourceType"
                        onChange={onDataItemTypeChanged}
                        helperText="Please select Data Item Type">
                            {dataItemTypeOptions.map((dataItem) => (
                                <MenuItem key={dataItem.key} value={dataItem.key}>{dataItem.value}</MenuItem>
                            ))}
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="selectScope"
                        select
                        label="Scope"
                        onChange={onScopeChanged}
                        helperText="Please select Scope">
                            {scopeOptions.map((scope) => (
                                <MenuItem key={scope.key} value={scope.key}>{scope.value}</MenuItem>
                            ))}
                    </TextField>

                    <TextField
                        id="selectSourceDataType"
                        select
                        label="DataSourceType"
                        onChange={onSourceDataTypeChanged}
                        helperText="Please select Data Source Type"
                        defaultValue = "">
                                {sourceDataTypeOptions.map((sourceData) => (
                                <MenuItem key={sourceData.key} value={sourceData.key}>{sourceData.value}</MenuItem>
                            ))}
                    </TextField>
                </div>

                <div>
                    <Button onClick={onMappingComplete}>SAVE</Button>
                </div>
            </form>
    )

};

export default TemplateMapping;
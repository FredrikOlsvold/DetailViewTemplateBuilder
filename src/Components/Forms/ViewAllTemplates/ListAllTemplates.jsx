import React, { useState } from "react";
import {allTemplates} from "../../../api/getData";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '@material-ui/core'
import { Add } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';

const ListAllTemplates = () => {

    const [templateList, setTemplateList] = useState([...allTemplates]);


    const onCreateNewClicked = () => {
        setTemplateList( templates => [...templates, "newElement"])
    };

    const onTemplateClicked = (event) => {
        console.log(event.target.innerHTML);
    };

    return(
        <>
        <h3>Detail View Templates</h3>
        <List>
            <ListItem>
            <Button
            type="button"
            onClick={onCreateNewClicked}
            variant="outlined"
            startIcon={<Add />}>CREATE NEW</Button> 
            </ListItem>

            {templateList.map((templateName, index) => (
                <ListItem key={index}>
                    <Button 
                    style={{minWidth: "200px", textAlign:"left"}}
                    onClick={onTemplateClicked}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    >{templateName}</Button>
                </ListItem>))} 
        </List>

        </>
    );
};

export default ListAllTemplates;
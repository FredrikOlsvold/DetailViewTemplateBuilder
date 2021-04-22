import React, { useState } from "react";
import { allTemplates } from "../../../api/getData";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Button, Grid, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";

const ListAllTemplates = () => {
  const [templateList, setTemplateList] = useState([...allTemplates]);

  const onCreateNewClicked = () => {
    setTemplateList((templates) => [...templates, "newElement"]);
  };

  const onTemplateClicked = (event) => {
    console.log(event.target.innerHTML);
  };

  return (
    <>
      <List>
        <Grid item>
          <ListItem>
            <Button
              type="button"
              onClick={onCreateNewClicked}
              variant="outlined"
              startIcon={<Add />}
            >
              CREATE NEW
            </Button>
          </ListItem>

          {templateList.map((templateName) => (
            <ListItem>
              <Button
                style={{ minWidth: "200px", textAlign: "left" }}
                onClick={onTemplateClicked}
                variant="outlined"
                startIcon={<EditIcon />}
              >
                {templateName}
              </Button>
            </ListItem>
          ))}
        </Grid>
      </List>
    </>
  );
};

export default ListAllTemplates;

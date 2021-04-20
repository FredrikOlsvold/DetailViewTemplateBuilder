import React, { useState } from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';

function OptionsCreator({setOptionList, optionList}) {

    const [optionKey, setOptionKey] = useState("");
    const [optionValue, setOptionValue] = useState("");

    const onOptionKeyChange =({target: {value}}) => {setOptionKey(value);};
    const onOptionValueChange =({target: {value}}) => {setOptionValue(value);};

    const addOptions = () => {
        // setOptionList(...optionList, 
        //     {
        //         id: getUniqueId(), 
        //         text: {key:optionKey, value:optionValue},
        //         );

        setOptionList([...optionList, 
            {
                id: getUniqueId(),
                text: {
                    key:optionKey, 
                    value:optionValue,
                },
            }]);

        setOptionKey("");
        setOptionValue("");
    };

  return (
    <>
    <Grid container spacing={0}>
        <Grid item xs={4}>
        <TextField
          id="optionskey"
          label="Key"
          value={optionKey}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onOptionKeyChange}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="optionsvalue"
          label="Value"
          value={optionValue}
          variant="outlined"
          style={{ width: "100%" }}
          onChange={onOptionValueChange}
        />
      </Grid>
      <Grid item xs={1}>
        <Button
          type="button"
          variant="contained"
          color="default"
          startIcon={<AddIcon />}
          onClick={addOptions}
        >
          OPTION
        </Button>
      </Grid>
    </Grid>
      
    </>
  );
}

let uniqueId = 0;
const getUniqueId = () => {
    return uniqueId++;
}


export default OptionsCreator;

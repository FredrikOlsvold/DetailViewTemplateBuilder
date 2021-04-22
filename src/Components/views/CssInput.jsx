import React from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import {cssAtom} from "../../store/Store";
import { useRecoilState } from "recoil";

const CssInput = () => {

    // const [cssInput, setCssInput] = useState("");
    const [cssInput, setCssInput] = useRecoilState(cssAtom);

    const handleCssChange = ({target: {value}}) => {
        setCssInput(value);
    };

    const saveCss = () => {
        console.log("CSS Saved");
        //Post request to update css
    }

    return (
        <>
        <div style={{padding: "2em"}}>

            <div>
                <TextField
                inputProps={{color:"red"}}
                id="cssInput"
                label="CSS Input"
                multiline
                rows={10}
                style={{ width: "100%" }}
                value={cssInput}
                variant="outlined"
                onChange={handleCssChange}
                defaultValue="Default Value"
                />
            </div>
            <div>
            <Button
            color="primary"
            type="button"
            variant="contained"
            startIcon={<SaveIcon/>}
            onClick={saveCss}
            >SAVE</Button>
            </div>
        </div>
        
       </>
    )
};

export default CssInput;
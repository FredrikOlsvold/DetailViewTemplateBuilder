import {Button} from "@material-ui/core";
import {useRecoilValue} from "recoil";
// import {fieldListAtom} from "../../App";
import {useState} from "react";
import { JsonPreviewSelector } from "../../Selectors/Selectors";


const ShowAll = () => {

    const previewJson = useRecoilValue(JsonPreviewSelector);
    const [displayJSON, setDisplayJSON] = useState(true);

    const showJSON = () => {
        setDisplayJSON(!displayJSON);
    }

    return(
        <div>
            <Button onClick={showJSON}>JSON</Button>

            {displayJSON && <pre>{JSON.stringify(previewJson, null, 2)}</pre>}
        </div>
        
    )
}

export default ShowAll;
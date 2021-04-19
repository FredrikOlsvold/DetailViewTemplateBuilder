import {Button} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {fieldListAtom} from "../../App";
import {useState} from "react";


const ShowAll = () => {

    const sectionList = useRecoilValue(fieldListAtom);
    const [displayJSON, setDisplayJSON] = useState(false);

    const showJSON = () => {
        setDisplayJSON(!displayJSON);
    }

    return(
        <div>
            <Button onClick={showJSON}>JSON</Button>

            {displayJSON && <pre>{JSON.stringify(sectionList)}</pre>}
        </div>
        
    )
}

export default ShowAll;
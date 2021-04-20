import { Button, TextareaAutosize, TextField } from "@material-ui/core";
import { useRecoilValue, useSetRecoilState } from "recoil";
// import {fieldListAtom} from "../../App";
import { useEffect, useState } from "react";
import { JsonPreviewSelector, TemplateJsonSelector } from "../../Selectors/Selectors";

const ShowAll = () => {

    const templateJson = useRecoilValue(TemplateJsonSelector)
  const previewJson = useRecoilValue(JsonPreviewSelector);
  const [displayJSON, setDisplayJSON] = useState(true);

  const updateJson = useSetRecoilState(JsonPreviewSelector);

  const [textValue, setTextValue] = useState("");

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
  };

//   const handleJsonTextAreaChange = (e) => {
//     updateJson(JSON.parse(e.target.value));
    
//   };

  return (
    <div>
      <Button onClick={showJSON}>JSON</Button>
      <div style={{ width: "50%" }}>
        {displayJSON && (
          <TextareaAutosize
            style={{ width: "100%" }}
            value={JSON.stringify(templateJson, null, 2)}
            
          ></TextareaAutosize>
        )}
      </div>
    </div>
  );
};

export default ShowAll;

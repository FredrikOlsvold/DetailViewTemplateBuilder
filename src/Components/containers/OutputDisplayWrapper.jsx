import {
  Button,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import {fieldListAtom} from "../../App";
import { useEffect, useState } from "react";
import { JsonPreviewSelector, TestSelector } from "../../selectors/Selectors";
import { copyToClipboard, jsonValidator } from "../../helpers/HelperMethods";
import { displayWrapperAtom, previewJsonAtom } from "../../store/Store";

const OutputDisplayWrapper = () => {
  //const previewJson = useRecoilValue(JsonPreviewSelector);
  const [previewJson, setPreviewJson] = useRecoilState(TestSelector);
  const setDisplayWrapperAtom = useSetRecoilState(displayWrapperAtom);
  const [displayJSON, setDisplayJSON] = useState(true);
  const [displayTemplate, setDisplayTemplate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
  };

  const handleCopyClick = () => {
    copyToClipboard(JSON.parse(textAreaValue));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleTextAreaChange = (e) => {
        setTextAreaValue(e.target.value);
     
  };

  const handleUseJsonClick = () => {
    if (jsonValidator(textAreaValue)) {
        setPreviewJson(JSON.parse(textAreaValue));
        setDisplayWrapperAtom("");
      }
  }

  useEffect(() => {
        setTextAreaValue(JSON.stringify(previewJson, null, 2))
  }, [previewJson])

  return (
    <Paper style={{ padding: "2em", margin: "1em" }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button
            onClick={showJSON}
            style={displayJSON ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Display JSON</Typography>
          </Button>
        </Grid>

        <Grid item xs={3}>
          <Button
            onClick={showJSON}
            style={displayTemplate ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Display Template</Typography>
          </Button>
        </Grid>
      </Grid>

      {displayJSON && (
        <>
          {/* <pre>{JSON.stringify(previewJson, null, 2)}</pre> */}
          <TextareaAutosize
            value={textAreaValue}
            onChange={handleTextAreaChange}
          />

          <Button
            size="small"
            type="button"
            variant="contained"
            color="default"
            onClick={handleUseJsonClick}
          >
            Use Json
          </Button>

          <Button
            size="small"
            type="button"
            variant="contained"
            color="default"
            onClick={handleCopyClick}
          >
            {copied ? "Json copied" : "Copy to clipboard"}
          </Button>
        </>
      )}

      {displayTemplate && <pre>{JSON.stringify(previewJson, null, 2)}</pre>}
    </Paper>
  );
};

export default OutputDisplayWrapper;

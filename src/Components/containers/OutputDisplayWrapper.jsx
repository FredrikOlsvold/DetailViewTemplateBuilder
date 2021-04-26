import {
  Button,
  Grid,
  Paper,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import {fieldListAtom} from "../../App";
import { useState } from "react";
import { JsonPreviewSelector, TestSelector } from "../../selectors/Selectors";
import { copyToClipboard, jsonValidator } from "../../helpers/HelperMethods";
import { previewJsonAtom } from "../../store/Store";

const OutputDisplayWrapper = () => {
  //const previewJson = useRecoilValue(JsonPreviewSelector);
  const [previewJson, setPreviewJson] = useRecoilState(TestSelector);
  const [displayJSON, setDisplayJSON] = useState(true);
  const [displayTemplate, setDisplayTemplate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
  };

  const handleCopyClick = () => {
    copyToClipboard(previewJson);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleTextAreaChange = (e) => {
    if (jsonValidator(e.target.value)) {
      setTextAreaValue(e.target.value);
      setPreviewJson(JSON.parse(e.target.value));
    }
  };

  const handlePreviewJsonPre = (e) => {
    setTextAreaValue(e.target.value);
  }

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
          <pre>{JSON.stringify(previewJson, null, 2)}</pre>
          <Button
            size="small"
            type="button"
            variant="contained"
            color="default"
            onClick={handleCopyClick}
          >
            {copied ? "Json copied" : "Copy to clipboard"}
          </Button>
          <TextareaAutosize
            value={textAreaValue}
            onChange={handleTextAreaChange}
          />

          
        </>
      )}

      {displayTemplate && <pre>{JSON.stringify(previewJson, null, 2)}</pre>}
    </Paper>
  );
};

export default OutputDisplayWrapper;

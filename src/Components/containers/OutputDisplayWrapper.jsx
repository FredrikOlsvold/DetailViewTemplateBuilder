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
import {
  TemplateDataSelector,
  TemplateJsonSelector,
} from "../../selectors/Selectors";
import { copyToClipboard, jsonValidator } from "../../helpers/HelperMethods";
import { displayWrapperAtom, cssAtom } from "../../store/Store";
import CssEditor from "../views/CssEditor";
import getDetailViewAndRender from "../../helpers/renderDetailView";
import DetailViewPreview from "../views/DetailViewPreview";

const OutputDisplayWrapper = () => {
  const [previewJson, setPreviewJson] = useRecoilState(TemplateJsonSelector);
  const setDisplayWrapperAtom = useSetRecoilState(displayWrapperAtom);
  const [displayJSON, setDisplayJSON] = useState(true);
  const [displayData, setDisplayData] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [newValue, setNewValue] = useState("default");
  const [templateData, setTemplateData] = useRecoilState(TemplateDataSelector);

  const [templateDataTextAreaValue, setTemplateDataTextAreaValue] =
    useState("");

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
  };

  const showData = () => {
    setDisplayData(!displayData);
  };

  const showStyle = () => {
    setDisplayStyle(!displayStyle);
  };

  const handleCopyClick = () => {
    copyToClipboard(JSON.parse(textAreaValue));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleTextAreaChange = (e) => {
    if (e.target.value !== previewJson) {
      setNewValue("primary");
    }
    setTextAreaValue(e.target.value);
  };

  const handleTemplateDataTextAreaChange = (e) => {
    setTemplateDataTextAreaValue(e.target.value);
    setTemplateData(JSON.parse(e.target.value));
    console.log(JSON.parse(e.target.value));
  };

  const handleUseJsonClick = () => {
    if (jsonValidator(textAreaValue)) {
      setNewValue("default");
      setPreviewJson(JSON.parse(textAreaValue));
      setDisplayWrapperAtom("");
    } else {
      alert("Not valid JSON");
    }
  };

  useEffect(() => {
    setTextAreaValue(JSON.stringify(previewJson, null, 2));
  }, [previewJson]);

  useEffect(() => {
    setTemplateDataTextAreaValue(JSON.stringify(templateData, null, 2));
  }, [templateData]);

  useEffect(() => {
    getDetailViewAndRender();
  }, [previewJson]);

  return (
    <Paper style={{ padding: "2em", margin: "1em" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            onClick={showJSON}
            style={displayJSON ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Template JSON</Typography>
          </Button>
          {displayJSON && (
            <Grid item xs={6}>
              {/* <pre>{JSON.stringify(previewJson, null, 2)}</pre> */}
              <TextareaAutosize
                style={{ minWidth: "400px" }}
                rowsMax={35}
                value={textAreaValue}
                onChange={handleTextAreaChange}
              />

              <Button
                size="small"
                type="button"
                variant="contained"
                color={newValue}
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
            </Grid>
          )}
        </Grid>

        <Grid item xs={6}>
          <Button
            onClick={showData}
            style={displayData ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Display Data</Typography>
          </Button>
          {displayData && (
            <Grid item xs={6}>
              <TextareaAutosize
                style={{ minWidth: "400px" }}
                rowsMax={35}
                value={templateDataTextAreaValue}
                onChange={handleTemplateDataTextAreaChange}
              ></TextareaAutosize>
            </Grid>
          )}
        </Grid>
        <Grid item xs={6}>
          <Button
            style={displayStyle ? { color: "#6200ee" } : { color: "#ccc" }}
            onClick={showStyle}
          >
            <Typography variant="h6"> Styling</Typography>
          </Button>
          {displayStyle && (
            <Grid item>
              <CssEditor />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OutputDisplayWrapper;

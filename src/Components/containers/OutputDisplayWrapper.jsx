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
  //const previewJson = useRecoilValue(JsonPreviewSelector);
  const [previewJson, setPreviewJson] = useRecoilState(TemplateJsonSelector);
  const setDisplayWrapperAtom = useSetRecoilState(displayWrapperAtom);
  const [displayJSON, setDisplayJSON] = useState(true);
  const [displayData, setDisplayData] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [newValue, setNewValue] = useState("default");
  const [templateData, setTemplateData] = useRecoilState(TemplateDataSelector);
  const [stylingAtom, setStylingAtom] = useRecoilState(cssAtom);

  const [templateDataTextAreaValue, setTemplateDataTextAreaValue] =
    useState("");

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
    // setDisplayData(false);
    // setDisplayStyle(false);
  };

  const showData = () => {
    setDisplayData(!displayData);
    // setDisplayJSON(false);
    // setDisplayStyle(false);
  };

  const showStyle = () => {
    setDisplayStyle(!displayStyle);
    // setDisplayData(false);
    // setDisplayJSON(false);
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
    setTemplateData(e.target.value);
    setTemplateDataTextAreaValue(e.target.value);
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
    setTemplateDataTextAreaValue(templateData);
  }, [previewJson, templateData]);

  useEffect(() => {
    getDetailViewAndRender();
  }, [previewJson]);

  return (
    <Grid container spacing={2}>
      <Paper style={{ padding: "2em", margin: "1em" }}>
        <Grid item xs={3}>
          <Button
            onClick={showJSON}
            style={displayJSON ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Template JSON</Typography>
          </Button>
        </Grid>

        <Grid item xs={3}>
          <Button
            onClick={showData}
            style={displayData ? { color: "#6200ee" } : { color: "#ccc" }}
          >
            <Typography variant="h6">Display Data</Typography>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            style={displayStyle ? { color: "#6200ee" } : { color: "#ccc" }}
            onClick={showStyle}
          >
            <Typography variant="h6"> Styling</Typography>
          </Button>
        </Grid>
        <Grid container spacing={2}>
          {displayJSON && (
            <Grid item xs={4}>
              {/* <pre>{JSON.stringify(previewJson, null, 2)}</pre> */}
              <TextareaAutosize
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
          {displayData && (
            <Grid item xs={3}>
              <TextareaAutosize
                value={templateDataTextAreaValue}
                onChange={handleTemplateDataTextAreaChange}
              ></TextareaAutosize>
            </Grid>
          )}
          {displayStyle && (
            <Grid item xs={3}>
              <CssEditor />
            </Grid>
          )}
          {/* <Grid item xs={3}>
            <DetailViewPreview />
          </Grid> */}
        </Grid>
        <Grid item={3}>
          <DetailViewPreview />
        </Grid>
      </Paper>
    </Grid>
  );
};

export default OutputDisplayWrapper;

import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { useRecoilValue } from "recoil";
// import {fieldListAtom} from "../../App";
import { useState } from "react";
import { JsonPreviewSelector } from "../../Selectors/Selectors";
import { copyToClipboard } from "../../Helpers/HelperMethods";

const OutputDisplayWrapper = () => {
  const previewJson = useRecoilValue(JsonPreviewSelector);
  const [displayJSON, setDisplayJSON] = useState(true);
  const [displayTemplate, setDisplayTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const showJSON = () => {
    setDisplayJSON(!displayJSON);
  };

  const handleCopyClick = () => {
    copyToClipboard(previewJson);
    setCopied(true)
    setTimeout(()=> {
        setCopied(false)
    }, 2000);
  };

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
          >{copied ? "Json copied" : "Copy to clipboard"}
          </Button>
        </>
      )}

      {displayTemplate && <pre>{JSON.stringify(previewJson, null, 2)}</pre>}
    </Paper>
  );
};

export default OutputDisplayWrapper;

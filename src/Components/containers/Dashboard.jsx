import React, { useState } from "react";
import WindowTitle from "../views/WindowTitle";
import Content from "../views/Content";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import CssEditor from "../views/CssEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { contentAtom, displayWrapperAtom, windowTitleAtom } from "../../store/Store";

const Dashboard = () => {
  const [displayWrapper, setDisplayWrapper] = useState("");
  const titleSectionList = useRecoilValue(windowTitleAtom);
  const contentSectionList = useRecoilValue(contentAtom);
  const [displayAtom, setDisplayAtom] = useRecoilState(displayWrapperAtom);
  

  return (
    <>
      <Paper style={{ padding: "2em", margin: "1em" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              style={
                displayAtom === "title"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayAtom("title")}
            >
              <Typography variant="h6"> Window Title</Typography>
            </Button>
          </Grid>

          <Grid item xs={3}>
            <Button
              style={
                displayAtom === "content"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayAtom("content")}
            >
              <Typography variant="h6"> Content</Typography>
            </Button>
          </Grid>

          <Grid item xs={3}>
            <Button
              style={
                displayAtom === "css"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayAtom("css")}
            >
              <Typography variant="h6"> Styling</Typography>
            </Button>
          </Grid>

          {/* Close Menu Button */}
          <Grid item xs={3}>
            <Button
              style={{ float: "right" }}
              startIcon={
                displayAtom === "title" ||
                displayAtom === "content" ||
                displayAtom === "css" ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              }
              onClick={() => setDisplayAtom("")}
            />
          </Grid>
        </Grid>

        {displayAtom === "title" && <WindowTitle titleSectionList={titleSectionList}/>}
        {displayAtom === "content" && <Content contentSectionList={contentSectionList} />}
        {/* {displayWrapper === "css" && <CssInput />} */}
        {displayAtom === "css" && <CssEditor />}
      </Paper>
    </>
  );
};

export default Dashboard;

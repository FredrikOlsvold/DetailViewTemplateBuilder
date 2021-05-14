import React, { useState } from "react";
import WindowTitle from "../views/WindowTitle";
import Content from "../views/Content";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import CssEditor from "../views/CssEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  contentAtom,
  displayWrapperAtom,
  windowTitleAtom,
} from "../../store/Store";

const Dashboard = () => {
  const [displayWrapper, setDisplayWrapper] = useState("");
  const [titleSectionList, setTitleSectionList] = useRecoilState(windowTitleAtom);
  const [contentSectionList, setContentSectionList] = useRecoilState(contentAtom);
  const [displayAtom, setDisplayAtom] = useRecoilState(displayWrapperAtom);

  return (
      <Paper style={{ padding: "2em", margin: "1em" }}>
        <Grid container spacing={2}>
          <Grid item>
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

          <Grid item>
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

          {/* Close Menu Button */}
          <Grid item>
            <Button
              style={{ float: "right" }}
              startIcon={
                displayAtom === "title" || displayAtom === "content" ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              }
              onClick={() => setDisplayAtom("")}
            />
          </Grid>
        </Grid>

        {displayAtom === "title" && (
          <WindowTitle titleSectionList={titleSectionList} setTitleSectionList={setTitleSectionList}/>
        )}
        {displayAtom === "content" && (
          <Content contentSectionList={contentSectionList} setContentSectionList={setContentSectionList} />
        )}
      </Paper>
  );
};

export default Dashboard;

import React, { useState } from "react";
import WindowTitle from "../views/WindowTitle";
import Content from "../views/Content";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import CssEditor from "../views/CssEditor";
import { useRecoilValue } from "recoil";
import { contentAtom, windowTitleAtom } from "../../store/Store";

const Dashboard = () => {
  const [displayWrapper, setDisplayWrapper] = useState("");
  const titleSectionList = useRecoilValue(windowTitleAtom);
  const contentSectionList = useRecoilValue(contentAtom);

  return (
    <>
      <Paper style={{ padding: "2em", margin: "1em" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              style={
                displayWrapper === "title"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayWrapper("title")}
            >
              <Typography variant="h6"> Window Title</Typography>
            </Button>
          </Grid>

          <Grid item xs={3}>
            <Button
              style={
                displayWrapper === "content"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayWrapper("content")}
            >
              <Typography variant="h6"> Content</Typography>
            </Button>
          </Grid>

          <Grid item xs={3}>
            <Button
              style={
                displayWrapper === "css"
                  ? { color: "#6200ee" }
                  : { color: "#ccc" }
              }
              onClick={() => setDisplayWrapper("css")}
            >
              <Typography variant="h6"> Styling</Typography>
            </Button>
          </Grid>

          {/* Close Menu Button */}
          <Grid item xs={3}>
            <Button
              style={{ float: "right" }}
              startIcon={
                displayWrapper === "title" ||
                displayWrapper === "content" ||
                displayWrapper === "css" ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              }
              onClick={() => setDisplayWrapper("")}
            />
          </Grid>
        </Grid>

        {displayWrapper === "title" && <WindowTitle titleSectionList={titleSectionList}/>}
        {displayWrapper === "content" && <Content contentSectionList={contentSectionList} />}
        {/* {displayWrapper === "css" && <CssInput />} */}
        {displayWrapper === "css" && <CssEditor />}
      </Paper>
    </>
  );
};

export default Dashboard;

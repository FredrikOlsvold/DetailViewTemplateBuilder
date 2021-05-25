import { useRecoilValue } from "recoil";
import { contentAtom } from "../../store/Store";
import { Grid, Typography } from "@material-ui/core";
import SectionItemCreator from "../section/creator/SectionItemCreator";
import SectionItemEditor from "../section/editor/SectionItemEditor";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const Content = ({ contentSectionList, setContentSectionList }) => {
  const handleOnDragEnd = (res) => {
    const content = Array.from(contentSectionList);
    const [reorderedContent] = content.splice(res.source.index, 1);
    content.splice(res.destination.index, 0, reorderedContent);

    setContentSectionList(content);
  };

  return (
    <div style={{ marginTop: "2em" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ borderRight: "1px solid #ccc" }}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Create Section
          </Typography>
          <SectionItemCreator wrapper={"content"} mode={"create"} />
        </Grid>

        <Grid item xs={6}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Edit Section
          </Typography>
          {contentSectionList.map((section) => (
              <SectionItemEditor
              item={section}
              wrapper={"content"}
              mode={"edit"}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;

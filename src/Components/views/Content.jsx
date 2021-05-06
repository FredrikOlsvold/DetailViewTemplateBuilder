import { useRecoilValue } from "recoil";
import { contentAtom } from "../../store/Store";
import { Grid, Typography } from "@material-ui/core";
import SectionItemCreator from "../section/creator/SectionItemCreator";
import SectionItemEditor from "../section/editor/SectionItemEditor";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const Content = ({ contentSectionList, setContentSectionList }) => {

    const handleOnDragEnd = (res) => {
        const content = Array.from(contentSectionList)
        const [reorderedContent] = content.splice(res.source.index, 1)
        content.splice(res.destination.index, 0, reorderedContent)

        setContentSectionList(content)
    }

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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="editSectionsContent">
              {(provided) => (
                <ul
                  className="editSectionsContent"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {contentSectionList.map((section, index) => (
                    <Draggable
                      key={section.Id}
                      draggableId={section.Id}
                      index={index}
                    >
                      {(provided) => (
                        <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <SectionItemEditor
                            item={section}
                            wrapper={"content"}
                            mode={"edit"}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          {/* <DragDropContext>
            <Droppable droppableId="editSectionContent">
              {(provided) => (
                <ul
                  className="editSectionsContent"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {contentSectionList.map((section, index) => (
                      <Draggable
                        key={index}
                        draggableId={index}
                        index={index}
                      >
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                            hello
                          <SectionItemEditor
                            key={section.Id}
                            item={section}
                            wrapper={"content"}
                            mode={"edit"}
                          />
                        </li>
                      </Draggable>
                    )
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext> */}
          {/* {contentSectionList.map((section) => (
                <SectionItemEditor key={section.Id} item={section} wrapper={"content"} mode={"edit"}/>
                ))} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;

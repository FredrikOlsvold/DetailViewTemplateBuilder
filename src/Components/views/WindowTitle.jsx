import SectionItemCreator from "../section/creator/SectionItemCreator";
import SectionItemEditor from "../section/editor/SectionItemEditor";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../store/Store";
import { Grid, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const WindowTitle = ({ titleSectionList, setTitleSectionList }) => {
  return (
    <div style={{ marginTop: "2em" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ borderRight: "1px solid #ccc" }}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Create Section
          </Typography>
          <SectionItemCreator wrapper={"title"} mode={"create"} />
        </Grid>

        {/* Edit Section */}
        <Grid item xs={6}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Edit Section
          </Typography>
          {titleSectionList.map((section, index) => (
            <SectionItemEditor
              key={section.Id}
              item={section}
              wrapper={"title"}
              mode={"edit"}
            />
          ))}

          {/* <DragDropContext>
            <Droppable droppableId="editSectionTitle">
              {(provided) => (
                <ul
                  className="editSectionsTitle"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {titleSectionList.map((section, index) => (
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
                        {" "}
                        <SectionItemEditor
                          key={section.Id}
                          item={section}
                          wrapper={"title"}
                          mode={"edit"}
                        />
                      </li>
                    </Draggable>
                  ))}
                </ul>
              )}
            </Droppable>
          </DragDropContext> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default WindowTitle;

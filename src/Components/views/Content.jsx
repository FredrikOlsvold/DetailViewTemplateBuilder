import { useRecoilValue } from "recoil";
import { contentAtom } from "../../store/Store";
import { Grid, Typography } from "@material-ui/core";
import SectionItemCreator from "../section/creator/SectionItemCreator";
import SectionItemEditor from "../section/editor/SectionItemEditor";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Content = ({ contentSectionList }) => {
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
          <DragDropContext>
            <Droppable droppableId="editSectionContent">
              {(provided) => (
                <ul
                  className="editSectionsContent"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {contentSectionList.map((section, index) => {return(
                    <Draggable
                      key={section.Id}
                      draggableId={section.Id}
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
                          wrapper={"content"}
                          mode={"edit"}
                        />
                      </li>
                    </Draggable>
                  )})}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          {/* {contentSectionList.map((section) => (
                <SectionItemEditor key={section.Id} item={section} wrapper={"content"} mode={"edit"}/>
                ))} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;

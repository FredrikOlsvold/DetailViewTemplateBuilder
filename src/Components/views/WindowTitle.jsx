import SectionItemCreator from "../section/creator/SectionItemCreator";
import SectionItemEditor from "../section/editor/SectionItemEditor";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../store/Store";
import { Grid, Typography } from "@material-ui/core";

const WindowTitle = () => {
  const sectionList = useRecoilValue(windowTitleAtom);

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
          {sectionList.map((section) => (
            <SectionItemEditor
              key={section.Id}
              item={section}
              wrapper={"title"}
              mode={"edit"}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
};


export default WindowTitle;

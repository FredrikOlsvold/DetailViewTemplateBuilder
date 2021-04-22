import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../Atoms/atoms";
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
          <SectionItemCreator wrapper={"title"} />
        </Grid>

        {/* Edit Section */}
        <Grid item xs={6}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Edit Section
          </Typography>
          {sectionList.map((section) => (
            <SectionItem
              key={getUniqueId()}
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

let uniqueId = 0;
const getUniqueId = () => {
  console.log(uniqueId);
  return uniqueId++;
};

export default WindowTitle;

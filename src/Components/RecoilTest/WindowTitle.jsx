import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../Atoms/atoms";
import { Grid, Typography } from "@material-ui/core";

const WindowTitle = () => {
  const sectionList = useRecoilValue(windowTitleAtom);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Create Section</Typography>

          <SectionItemCreator mode={"create"} wrapper={"title"} />
        </Grid>

        {/* Edit Section */}
        <Grid item xs={6}>
          <Typography>Edit Section</Typography>
          {sectionList.map((section, index) => (
            <SectionItem
              key={section.id}
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

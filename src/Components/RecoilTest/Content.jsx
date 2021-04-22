import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { contentAtom } from "../../Atoms/atoms";
import { Grid, Typography } from "@material-ui/core";

const Content = () => {
  const sectionList = useRecoilValue(contentAtom);

  return (
    <div style={{ marginTop: "2em" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ borderRight: "1px solid #ccc" }}>
          <Typography
            style={{ textAlign: "center", textDecoration: "underline" }}
          >
            Create Section
          </Typography>
          <SectionItemCreator wrapper={"content"} />
        </Grid>

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
              wrapper={"content"}
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

export default Content;

import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { contentAtom } from "../../Atoms/atoms";
import { Grid, Typography } from "@material-ui/core";

const Content = () => {

    const sectionList = useRecoilValue(contentAtom);

    return(
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                <Typography>Create Section</Typography>
                    <SectionItemCreator wrapper={"content"}/>
                </Grid>

                <Grid item xs={6}>
                <Typography>Edit Section</Typography>
                {sectionList.map((section, index) => (
                <SectionItem key={index} item={section} wrapper={"content"}/>
                ))}
                </Grid>
                </Grid>

        </div>
    )
};

export default Content;
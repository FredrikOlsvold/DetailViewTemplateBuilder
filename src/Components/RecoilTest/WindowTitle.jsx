import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../Atoms/atoms";
import { Grid, Typography } from "@material-ui/core";

const Content = () => {

    const sectionList = useRecoilValue(windowTitleAtom);

    return(
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SectionItemCreator wrapper={"title"}/>
                </Grid>

                <Grid item xs={6}>
                    {sectionList.map((section) => (
                    <SectionItem key={section.id} item={section} wrapper={"title"}/>
                    ))}
                </Grid>

            </Grid>
            

            
        </div>
    )
};

export default Content;
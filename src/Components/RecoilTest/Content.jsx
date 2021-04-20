import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { contentAtom } from "../../Atoms/atoms";
import { Grid } from "@material-ui/core";

const Content = () => {

    const sectionList = useRecoilValue(contentAtom);

    return(
        <div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SectionItemCreator wrapper={"content"}/>
                </Grid>

                <Grid item xs={6}>

                {sectionList.map((section) => (
                <SectionItem key={section.id} item={section} wrapper={"content"}/>
                ))}
                </Grid>
                </Grid>

        </div>
    )
};

export default Content;
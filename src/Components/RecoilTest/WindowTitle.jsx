import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { windowTitleAtom } from "../../Atoms/atoms";

const Content = () => {

    const sectionList = useRecoilValue(windowTitleAtom);

    return(
        <div>
            <h3>Window Title</h3>
            <SectionItemCreator wrapper={"title"}/>
            <br></br>
            <br></br>
            {sectionList.map((section) => (
                <SectionItem key={section.id} item={section} wrapper={"title"}/>
            ))}
        </div>
    )
};

export default Content;
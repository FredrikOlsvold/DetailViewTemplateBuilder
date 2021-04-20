import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";
import { useRecoilValue } from "recoil";
import { contentAtom } from "../../Atoms/atoms";

const Content = () => {

    const sectionList = useRecoilValue(contentAtom);

    return(
        <div>
            <h3>Content</h3>
            <SectionItemCreator wrapper={"content"}/>
            <br></br>
            <br></br>
            {sectionList.map((section) => (
                <SectionItem key={section.id} item={section} wrapper={"content"}/>
            ))}
        </div>
    )
};

export default Content;
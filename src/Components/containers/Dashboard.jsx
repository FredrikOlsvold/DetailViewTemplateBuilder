import React from "react";
import {fieldListAtom} from "../../App";
import {useRecoilValue} from "recoil";
import SectionItemCreator from "../RecoilTest/SectionItemCreator";
import SectionItem from "../RecoilTest/SectionItem";


const Dashboard = () => {

    const sectionList = useRecoilValue(fieldListAtom);

    return(
        <>
            <br></br>
            <SectionItemCreator/>
            <br></br>
            {sectionList.map((section) => (
                <SectionItem key={section.id} item={section}/>
            ))}
        </>
    );

}

export default Dashboard;
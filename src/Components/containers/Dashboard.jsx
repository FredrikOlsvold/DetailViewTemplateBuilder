import React, {useState} from "react";
import WindowTitle from "../RecoilTest/WindowTitle";
import Content from "../RecoilTest/Content";
import { Button } from "@material-ui/core";


const Dashboard = () => {

    const [displayWrapper, setDisplayWrapper] = useState("");

    return(
        <>
            <Button onClick={() => setDisplayWrapper("title")}>Window Title</Button>
            <Button onClick={() => setDisplayWrapper("content")}>Content</Button>

            {displayWrapper === "title" && <WindowTitle/>}
            {displayWrapper === "content" && <Content/>}
            
                          
        </>
    );

}

export default Dashboard;
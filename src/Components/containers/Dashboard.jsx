import React, {useState} from "react";
import WindowTitle from "../RecoilTest/WindowTitle";
import Content from "../RecoilTest/Content";
import { Button, Paper } from "@material-ui/core";
import CssInput from "../Forms/AddCss/CssInput";


const Dashboard = () => {

    const [displayWrapper, setDisplayWrapper] = useState("");

    return(
        <>
            <Paper style={{padding:"2em", margin:"1em"}}>
                <Button style={displayWrapper === "title" ? {color: "#6200ee"} : {color: "#ccc"}} indicatorColor="primary" onClick={() => setDisplayWrapper("title")}>Window Title</Button>
                <Button style={displayWrapper === "content" ? {color: "#6200ee"} : {color: "#ccc"}} onClick={() => setDisplayWrapper("content")}>Content</Button>
                <Button style={displayWrapper === "css" ? {color: "#6200ee"} : {color: "#ccc"}} onClick={() => setDisplayWrapper("css")}>Styling</Button>

                {displayWrapper === "title" && <WindowTitle/>}
                {displayWrapper === "content" && <Content/>}
                {displayWrapper === "css" && <CssInput/>}     
            </Paper>
            
            
                          
        </>
    );

}

export default Dashboard;
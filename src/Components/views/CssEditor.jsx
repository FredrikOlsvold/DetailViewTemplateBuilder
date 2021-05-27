import { useState, useEffect } from "react";
import * as Prism from "prismjs";
import "./styles.css";
import { cssEditorValueAtom } from "../../store/Store";
import { useRecoilState } from "recoil";
import { Button } from "@material-ui/core";
import Editor from "react-simple-code-editor";
import { highlight } from "prismjs/components/prism-core";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-css";

const CssEditor = ({ cssEditorContent, handleCssEditorChange }) => {
  const [cssEditorAtom, setCssEditorAtom] = useRecoilState(cssEditorValueAtom);

  const handleUseCssButton = () => {
    setCssEditorAtom(cssEditorContent);
  };

  useEffect(() => {
    console.log(cssEditorContent);
  }, [cssEditorContent]);

  return (
    <>
      <Editor
        style={{ minHeight: "500px", backgroundColor: '#2d2d2d', color: 'white' }}
        value={cssEditorContent}
        onValueChange={(content) => handleCssEditorChange(content)}
        highlight={(content) => highlight(content, Prism.languages.css, 'css')}
        padding={10}
      />
      <Button
        size="small"
        type="button"
        variant="contained"
        onClick={handleUseCssButton}
      >
        Use Css
      </Button>
    </>
  );
};

export default CssEditor;

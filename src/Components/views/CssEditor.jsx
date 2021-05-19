import { useState, useEffect } from "react";
import * as Prism from "prismjs";
import "./styles.css";
import { cssEditorValueAtom } from "../../store/Store";
import { useRecoilState } from "recoil";
import { Button } from "@material-ui/core";
import Editor from "react-simple-code-editor";
import "../../assets/css/prism.css";
import "prismjs/components/prism-css"; //Syntax highlighting for css
import { highlight, languages } from "prismjs/components/prism-core";
import 'prismjs/components/prism-css'

const CssEditor = () => {
  const [content, setContent] = useState();
  const [cssEditorAtom, setCssEditorAtom] = useRecoilState(cssEditorValueAtom);

  const handleUseCssButton = () => {
    setCssEditorAtom(content);
  };

  const handleKeyDown = (e) => {
    let value = content,
      selStartPos = e.currentTarget.selectionStart;

    // handle 4-space indent on
    if (e.key === "Tab") {
      value =
        value.substring(0, selStartPos) +
        "    " +
        value.substring(selStartPos, value.length);
      e.currentTarget.selectionStart = selStartPos + 3;
      e.currentTarget.selectionEnd = selStartPos + 4;
      e.preventDefault();

      setContent(value);
    }
  };

//   useEffect(() => {
//     Prism.highlightAll();
//   }, [content]);

  return (
    <>
      <div className="code-edit-container">
        {/* <textarea
          className="code-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          />
        <pre className="code-output">
          <code className="language-css">{content}</code>
        </pre> */}
        <Editor
          className="code-input"
          value={content}
          onValueChange={(content) => setContent(content)}
          highlight={(content) => highlight(content, Prism.languages.css, 'css')}
          padding={10}
        />
      </div>
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

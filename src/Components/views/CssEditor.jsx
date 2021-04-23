import { useState, useEffect } from "react";
import Prism from "prismjs";
import "./styles.css";

const CssEditor = () => {
  const [content, setContent] = useState();

  const handleKeyDown = (e) => {
    let value = content,
      selStartPos = e.currentTarget.selectionStart;

    console.log(e.currentTarget);

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

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <>
      <div className="code-edit-container">
        <textarea
          className="code-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <pre className="code-output">
          <code className="language-css">{content}</code>
        </pre>
      </div>
    </>
  );
};

export default CssEditor;

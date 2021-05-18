import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getDetailViewAndRender } from "../../helpers/HelperMethods";
import {
  TemplateDataSelector,
  TemplateJsonSelector,
} from "../../selectors/Selectors";
import { mockWorkOrder as defaultData } from "../../api/getData"; //Some api call in later version?
import {cssEditorValueAtom} from "../../store/Store";

function DetailViewPreview() {
  const templateJson = useRecoilValue(TemplateJsonSelector);
  const templateData = useRecoilValue(TemplateDataSelector);
  const cssValue = useRecoilValue(cssEditorValueAtom);

  useEffect(() => {
    let dv = document.getElementById("dv");
    console.log(JSON.stringify(defaultData));
    templateData === ""
      ? dv.reRender(
          defaultData,
          templateJson.Content,
          cssValue
        )
      : dv.reRender(templateData, templateJson.Content, cssValue);
  }, [templateJson, templateData, cssValue]);
  return (
    <div id="temp" style={{ width: "460px" }}>
      <generic-detail-view viewClass="content" id="dv"></generic-detail-view>
    </div>
  );
}

export default DetailViewPreview;

import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getDetailViewAndRender } from "../../helpers/HelperMethods";
import {
  TemplateDataSelector,
  TemplateJsonSelector,
} from "../../selectors/Selectors";
import { mockWorkOrder as defaultData } from "../../api/getData"; //Some api call in later version?

function DetailViewPreview() {
  const templateJson = useRecoilValue(TemplateJsonSelector);
  const templateData = useRecoilValue(TemplateDataSelector);

  useEffect(() => {
    let dv = document.getElementById("dv");
    templateData === ""
      ? dv.reRender(
          defaultData,
          templateJson.Content,
          "table{background-color: yellow}"
        )
      : dv.reRender(templateData, templateJson.Content);
  }, [templateJson, templateData]);
  return (
    <div id="temp" style={{ width: "460px;" }}>
      <generic-detail-view id="dv"></generic-detail-view>
    </div>
  );
}

export default DetailViewPreview;

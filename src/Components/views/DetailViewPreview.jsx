import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { getDetailViewAndRender } from '../../helpers/HelperMethods'
import { TemplateDataSelector, TemplateJsonSelector } from '../../selectors/Selectors'
import {mockWorkOrder as defaultData} from '../../api/getData'

function DetailViewPreview() {
    const templateJson = useRecoilValue(TemplateJsonSelector)
    const templateData = useRecoilValue(TemplateDataSelector)

    useEffect(() => {
        let dv = document.getElementById("dv");
        templateData === "" ? dv.reRender(defaultData, templateJson.Content) : dv.reRender(templateData, templateJson.Content) 
    }, [templateJson, templateData])
    return (
        <div id="temp">
        <generic-detail-view id="dv"></generic-detail-view>
          
        </div>
    )
}

export default DetailViewPreview

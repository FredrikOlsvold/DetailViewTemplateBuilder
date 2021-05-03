import { customElement, LitElement } from "lit-element";
import { html, TemplateResult } from "lit-html";
import {mockWorkOrder} from "../api/getData";
import {workOrderTemplate} from "../api/getTemplate";
import {TestSelector} from "../selectors/Selectors";

class DetailView extends LitElement{

    const newEngine = new window.TemplateEngine(null, this);

    
    render() {
        // console.log("What is this:", this);
        // if (mockWorkOrder) {
        //     this.requestUpdate();
        //     return null;
        // }
        return html`<div>
                        <h1>Welcome to the party</h1>
                    </div>`
        // return html`
        // <link rel='stylesheet' href='/assets/css/genericdetailview.css'>
        // <link rel='stylesheet' href='${this.stylingPath}'>
        // <link rel="stylesheet" href="/api/css/?tag=${this.tagName}&cid=${this.templateId}">
        //         <div class="panel">
        //             <div class='detail-view content'">
        //                 <div class='content'>
        //                     ${this.newEngine.renderData(mockWorkOrder, workOrderTemplate)}
        //                 </div>
        //         </div>
        //     </div> `;
    }    
}

customElements.define("detail-view", DetailView);
import { LitElement } from "lit-element";
import { html, TemplateResult } from "lit-html";
import {mockWorkOrder} from "../api/getData";
import {workOrderTemplate} from "../api/getTemplate";

class DetailView extends LitElement{

    
    constructor(){
        super();
        this.newEngine = new window.TemplateEngine(null, this);
        console.log("This:", this);
    }

    render() {
        if (!mockWorkOrder) {
            this.requestUpdate();
            return null;
        }



        return html`
                <div class="panel">
                    <div class='detail-view content'">
                        <div class='content'>
                            ${this.newEngine.renderData(mockWorkOrder, workOrderTemplate.Content)}
                        </div>
                    </div>
                </div> `;
    }    
}

customElements.define("detail-view", DetailView);
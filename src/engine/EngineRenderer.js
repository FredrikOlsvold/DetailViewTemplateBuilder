import { LitElement } from "lit-element";
import { html } from "lit-html";
import {unsafeHTML} from 'lit-html/directives/unsafe-html'
import { mockWorkOrder } from "../api/getData";
import { workOrderTemplate } from "../api/getTemplate";

class DetailView extends LitElement {
  constructor() {
    super();
    this.newEngine = new window.TemplateEngine(null, this);
    console.log("This:", this);
  }

  render() {
    if (!mockWorkOrder) {
      this.requestUpdate();
      return null;
    }

    let temp = [
        {
          Id: "8d73ad8c-b7dd-4f87-bb25-e2c26b8b8ec8",
          Type: "Standard",
          Options: {},
          Fields: [
            {
              Id: "32e57b17-b4ac-4e27-8087-9d0c48fd3fb7",
              Type: "LabelWithData",
              Label: "Label",
              Options: {},
              Formatters: [],
              ValueDescriptors: {
                Path: "WorkOrderId",
                Type: "string",
              },
            },
          ],
        },
      ];

    return html`
                <div class="panel">
                    <div class='detail-view content'">
                        <div class='content'>
                            ${unsafeHTML`${this.newEngine.renderData(mockWorkOrder, temp).getHTML()}`}
                        </div>
                    </div>
                </div> `;
  }
}

customElements.define("detail-view", DetailView);

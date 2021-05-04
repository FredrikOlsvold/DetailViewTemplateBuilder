export default function getDetailViewAndRender(){
    let dv = document.getElementById("dv");
    dv.reRender( {WorkOrderId:"123hallo"}, [
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
      ])
}
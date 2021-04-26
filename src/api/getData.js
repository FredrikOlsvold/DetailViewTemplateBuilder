export const mockWorkOrder = {
    "PersonResponsible":null,
    "MaterialStatus":{"Code":"no need","Name":"No Need"},
    "CriticalityType":{"Code":"high","Name":"High"},
    "MaintenanceType":{"Code":"pm03","Name":"PM03"},
    "PriorityType":{"Code":"b-high","Name":"B-High"},
    "WorkOrderStatus":{"Code":"rsch","Name":"RSCH"},
    "WorkOrderType":{"Code":"workorder","Name":"Workorder"},
    "EntityResponsible":{"Code":null,"Name":null},
    "EntityResponsibleGroup":{"Code":"ai","Name":"AI"},
    "Description":"112710-A VENTILER VED PROD MANIFOLD",
    "DetailedDescription":"112710-A VENTILER VED PROD MANIFOLD\nVEDLIKEHOLD AV VENTILER VED PROD\nMANIFOLD\n",
    "WorkOrderId":"000300153175",
    "ParentWorkorderId":"6000-WP202113",
    "FunctionalLocation":"VWP-112710","Id":
    "adddcd2c-1721-40b3-a600-000dbb920fd8",
    "DataSourceType":"",
    "AssetId":"VAL",
    "LocationCode":"VWP",
    "ScheduledStartDateTime":"2021-06-17T07:00:00",
    "ScheduledEndDateTime":"2021-06-17T09:10:55",
    "CalculatedStartDateTime":"2021-06-17T07:00:00",
    "CalculatedEndDateTime":"2021-06-17T09:10:55",
    "DueDateTime":"2021-07-25T00:00:00",
    "EquipmentId":null,
    "DurationHours":1.5,
    "RemainingHours":0.0,
    "ExtendedInfo":{"workorderrevisioncode":"WP",
                    "workorderaggregatedstatus":"None",
                    "workorderholdstatus":"false"},
    "ExtendedValues":[
        {"Key":"WorkOrderRevisionCode","Value":"WP"},
        {"Key":"WorkOrderAggregatedStatus","Value":"None"},
        {"Key":"WorkOrderHoldStatus","Value":"false"}],
    "Children":[],
    "Operations":[
        {"Areas":["AK|VAL|WP|ZD","AK|VAL|WP"],
        "Systems":["11"],
        "HseRisk":["High"],
        "OperationStatus":{"Code":"executing","Name":"Executing"},
        "ShutdownJob":null,
        "PersonResponsible":{"Code":"","Name":""},
        "Description":"112710-A VENTILER FOR PROD MANIFOLD",
        "DetailedDescription":"112710-A VENTILER FOR PROD MANIFOLD&#x0D;\nUtfør rutine: I(IP)005&#x0D;\nVARMT ARBEID B&#x0D;\n",
        "OperationId":"0010",
        "ScheduledStartDateTime":"2021-06-17T07:00:00",
        "ScheduledEndDateTime":"2021-06-17T09:10:55",
        "CalculatedStartDateTime":"2021-06-17T07:00:00",
        "CalculatedEndDateTime":"2021-06-17T09:10:55",
        "ExtendedInfo":
            {"workorderrevisioncode":"WP",
            "workorderaggregatedstatus":"None",
            "workorderholdstatus":"false"},
        "Qualifications":[
            {"EntityResponsible":{
                "Code":"aiins",
                "Name":"AIINS"},
            "ManHours":3.0,
            "HeadCount":2.0,
            "RemainingHours":0.0,
            "IsRemoved":false,
            "WorkPeriods":[]}],
        "Relations":[],
        "IsDeleted":false,
        "IsFiltered":false,
        "LastChanged":"0001-01-01T00:00:00",
        "RescheduledInClient":false}],
        "Files":[],
        "IsDeleted":false,
        "IsFiltered":false,
        "LastChanged":"0001-01-01T00:00:00+00:00",
        "RescheduledInClient":false
};

export const mockBasisPlanItem = {
    "PlanId": "2796557",
    "ParentPath": "Operations & Management|Management & Catering (MNGT & CATER)|PH",
    "Name": "87258302 ESS / Norrøna - Servicturer 20",
    "Id": "c20ffbfb-f215-4edf-b118-00fa47c3889d",
    "LocationCode": "CEN",
    "AssetId": "VAL",
    "Area": "AK|VAL|CEN",
    "Areas": ["AK|VAL|CEN"],
    "StartDate": "2021-08-16T08:00:00",
    "EndDate": "2021-08-20T16:00:00",
    "IsGroup": false,
    "IsDeleted": false,
    "IsFiltered": false,
    "LastChanged": "0001-01-01T00:00:00+00:00",
    "RescheduledInClient": false,
    "ExtendedInfo": null
};

export const scopeOptions = [
    {
        key: "TBR",
        value: "TBR",
    },
    {
        key: "Block 57",
        value: "Block 57",
    },
    {
        key: "U300",
        value: "U300",
    },
];

export const dataItemTypeOptions = [
    {
        key: "operation",
        value: "1",
    },
    {
        key: "workorder",
        value: "4",
    },
    {
        key: "productionindicators",
        value: "5",
    },
    {
        key: "basisplan",
        value: "16",
    },
    {
        key: "workpermit",
        value: "32",
    },
];

export const sourceDataTypeOptions = [
    {
        key: "maintananceplan",
        value: "Maintanance Plan",
    },
    {
        key: "basisplan",
        value: "Basisplan",
    },
    {
        key: "direct-planning",
        value: "Direct-Planning",
    },
];

export const allTemplates = [
    "WorkOrder_ESP",
    "Operation_ESP",
    "Request_ESP",
    "WordOrder_ENG",
    "Operation_ENG",
    "Request_ENG"
];

// export const sectionTypes = [
//     "",
//     "Header",
//     "Standard",
//     "Column",
//     "ClickableList",
//     "Table",
//     "Type 6",
//     "Tab",
//     "ExternalData"
// ];


export const sectionTypes = [
    "",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
];

export const optionTypes = [
    "",
    "datasource",
    "ListItemIdentifier",
    "TemplateId",
    "Source",
    "Title"
];
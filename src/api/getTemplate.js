export const workOrderTemplate = {
  "Title": [
    {
      "Type": "1",
      "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
      "Fields": [
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "8",
          "Value": "WorkOrderId",
          "Format": "large"
        }
      ]
    }
  ],
  "Content": [
    {
      "Type": "3",
      "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
      "Fields": [
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "21",
          "Value": "WorkOrderStatus.Name",
          "Format": "uppercase"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "4",
          "Value": "ScheduledStartDateTime",
          "Format": "dd.MM.yyyy"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "1",
          "Value": "ExtendedInfo.workorderrevisioncode",
          "Format": "lowercase"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "4",
          "Value": "ScheduledEndDateTime",
          "Format": "dd.MM.yyyy"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "1",
          "Value": "PriorityType.Name",
          "Format": "uppercase"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "4",
          "Value": "DueDateTime",
          "Format": "dd.MM.yyyy"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "1",
          "Value": "EntityResponsibleGroupName",
          "Format": "lowercase"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "1",
          "Value": "FunctionalLocation",
          "Format": "lowercase"
        }
      ]
    },
    {
      "Type": "4",
      "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
      "Options": [
        {
          "Key": "ListItemIdentifier",
          "Value": "OperationId"
        },
        {
          "Key": "TemplateId",
          "Value": "b0ef1934"
        },
        {
          "Key": "Source",
          "Value": "Operations"
        }
      ],
      "Fields": [
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "6",
          "Value": "OperationId"
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "7",
          "Value": " "
        },
        {
          "Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
          "Type": "6",
          "Value": "Description"
        }
      ]
    }
  ]
};

export const basisPlanItem = {};

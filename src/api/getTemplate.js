export const workOrderTemplate = {
	"Header": [
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
					"Label": "Status:",
					"Format": "uppercase"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "4",
					"Value": "ScheduledStartDateTime",
					"Label": "Start:",
					"Format": "dd.MM.yyyy"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "1",
					"Value": "ExtendedInfo.workorderrevisioncode",
					"Label": "Rev.Code:",
					"Format": "lowercase"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "4",
					"Value": "ScheduledEndDateTime",
					"Label": "End:",
					"Format": "dd.MM.yyyy"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "1",
					"Value": "PriorityType.Name",
					"Label": "Priority:",
					"Format": "uppercase"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "4",
					"Value": "DueDateTime",
					"Label": "Due Date:",
					"Format": "dd.MM.yyyy"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "1",
					"Value": "EntityResponsibleGroupName",
					"Label": "Responsible:",
					"Format": "lowercase"
				},
				{
					"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
					"Type": "1",
					"Value": "FunctionalLocation",
					"Label": "Tag:",
					"Format": "lowercase"
				}
			]
		},
		{
			"Type": "4",
			"Id": "520ECD6A-0D2B-415B-8B23-0000000A12AF",
			"Options": {
				"ListItemIdentifier": "OperationId",
				"TemplateId": "b0ef1934-c557-4a5a-ac34-89e2d1ac057e",
				"Source": "Operations",
				"Title": "Operations",
				"SortOrder": "Asc"
			},
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

export const basisPlanItem = {

};
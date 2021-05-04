//Updates a given array with new value
export function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

//Removes item from array
export function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

//Creates a unique guid
export function uniqueGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//Function creates new element, sets its value to be a json, and executes
//a copy command on the new element before deleting the element
export function copyToClipboard(json) {
  const el = document.createElement("textarea");
  el.value = JSON.stringify(json, null, 2);
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

//Checks if the provided string can be parsed as a json
export function jsonValidator(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

export function listToObject(list) {
  try {
    let singleObject = {};
    list.forEach((obj) => {
      singleObject[obj.Key] = obj.Value;
    });

    return singleObject;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

export function objectToList(object) {
  try {
    let list = [];
    for (const [key, value] of Object.entries(object)) {
      list.push({ Key: key, Value: value });
    }
    return list;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

//return regular list
export function formatFormatList(list) {
  try {
    let newList = [];

    list.forEach((obj) => {
      newList.push(`${obj.Key}(${obj.Value})`);
    });

    return newList;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

//return list of objects
export function unformatFormatList(list) {
  try {
    let newList = [];

    list.forEach((item) => {
      let firstParentheses = item.indexOf("(");
      let lastParentheses = item.indexOf(")");

      newList.push({
        Key: item.slice(0, firstParentheses),
        Value: item.slice(firstParentheses + 1, lastParentheses),
      });
    });

    return newList;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}


//Renders the detailview on the generic-detail-view tag
// data: {WorkOrderId:"123hallo"}
// template: [
//         {
//             Id: "9e5217b7-8d6f-467c-b0d0-0359b23d38a4",
//             Type: "ClickableList",
//             Options: {},
//             Fields: [
//               {
//                 Id: "d2a0dc51-b744-4046-9482-c23ed555a8a4",
//                 Type: "LabelWithData",
//                 Label: "wer",
//                 Options: {},
//                 Formatters: [],
//                 ValueDescriptor: {
//                   Path: "WorkOrderId",
//                   Type: "string"
//                 }
//               }
//             ]
//           }
//         ]
export function getDetailViewAndRender(data, template){
    let dv = document.getElementById("dv");
    dv.reRender(data, template)
}

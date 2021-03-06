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
  let singleObject = {};
  list.forEach((obj) => {
    singleObject[obj.Key] = obj.Value;
  });

  return singleObject;
}

export function objectToList(object) {
  try {
    let list = [];
    for (const [key, value] of Object.entries(object)) {
      list.push({ Key: key, Value: value });
    }
    return list;
  }catch(error){
    console.log(error.message);
    return [];
  }

}

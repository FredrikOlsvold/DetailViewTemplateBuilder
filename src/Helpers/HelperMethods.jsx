//Updates a given array with new value
export function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

//Removes item from array
export function removeItemAtIndex(arr, index) {
return [...arr.slice(0, index), ...arr.slice(index + 1)];
};


//Creates a unique guid
export function uniqueGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
//Updates a given array with new value
export function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

//Removes item from array
export function removeItemAtIndex(arr, index) {
return [...arr.slice(0, index), ...arr.slice(index + 1)];
};
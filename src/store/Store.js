import {atom} from "recoil";
import {workOrderObject} from "../../src/api/getTemplate";

//Atom that stores chosen window title sections in a list. Global state
export const windowTitleAtom = atom({
key: "windowTitleAtom",
default: workOrderObject.title,
});

//Atom that stores chosen content sections in a list. Global state
export const contentAtom = atom({
key: "contentAtom",
default: [],
});

export const cssAtom = atom({
    key: "cssAtom",
    default: "Give me some styling...",
});
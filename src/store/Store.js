import {atom} from "recoil";

//Atom that stores chosen window title sections in a list. Global state
export const windowTitleAtom = atom({
key: "windowTitleAtom",
default: [],
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

//PreviewJson Atom
export const previewJsonAtom = atom({
    key: "previewJsonAtom",
    default: {}
})

//PreviewJson Atom
export const displayWrapperAtom = atom({
    key: "displayWrapperAtom",
    default: "",
})

//Template Data Atom
export const templateDataAtom = atom({
    key: "templateDataAtom",
    default: "",
})
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

//Atom for whole json, Global state
export const TemplateJsonAtom = atom({
    key: 'TemplateJsonAtom',
    default: {
        title: [],
        content: []
    },
})
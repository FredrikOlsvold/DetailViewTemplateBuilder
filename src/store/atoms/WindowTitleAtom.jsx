import {atom} from "recoil";


export const WindowTitleAtom = atom({
    key: "WindowTitleAtom",
    default: {
        title: [{
            type:"",
            id: "",
            options: [],
            fields: [],
        }]
    },
});

export const WindowTitleDataAtom = atom({
    key: "WindowTitleDataAtom",
    default: [{
        id: "",
        type: "",
        value: "",
        format: "",
    }],
});
import { selector } from "recoil";
import { windowTitleAtom, contentAtom, TemplateJsonAtom } from "../Atoms/atoms";

export const JsonPreviewSelector = selector({
  key: "JsonPreviewSelector",
  get: ({ get }) => {
    const titleWrapper = get(windowTitleAtom);
    const contentWrapper = get(contentAtom);
    try {
      return {
        title: titleWrapper,
        content: contentWrapper,
      };
    } catch (error) {
      console.log(error.message);
    }
  },
  set: ({ set }, newJson) => {
    set(windowTitleAtom, newJson.title);
    set(contentAtom, newJson.content);
  },
});

//Selector for TemplateJsonAtom
export const TemplateJsonSelector = selector({
  key: "TemplateJsonSelector",
  get: ({ get }) => {
    try {
      return get(TemplateJsonAtom);
    } catch (error) {
      console.log(error);
    }
  },
  set: ({ set }, section) => {
    set(TemplateJsonAtom, section);
  },
});

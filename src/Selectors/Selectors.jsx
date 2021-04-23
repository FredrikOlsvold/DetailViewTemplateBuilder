import { selector } from "recoil";
import { windowTitleAtom, contentAtom, previewJsonAtom } from "../store/Store";

export const JsonPreviewSelector = selector({
  key: "JsonPreviewSelector",
  get: ({ get }) => {
    const titleWrapper = get(windowTitleAtom);
    const contentWrapper = get(contentAtom);
    try {
      return {
        Title: titleWrapper,
        Content: contentWrapper,
      };
    } catch (error) {
      console.log(error.message);
    }
  },
});

export const TestSelector = selector({
  key: "TestSelector",
  get: ({ get }) => {
    const titleWrapper = get(windowTitleAtom);
    const contentWrapper = get(contentAtom);
    try {
      return {
        Title: titleWrapper,
        Content: contentWrapper,
      };
    } catch (error) {
      console.log(error.message);
    }
  },
  set: ({ set }, newValue) => {
    try {
      set(windowTitleAtom, newValue.title);
      set(contentAtom, newValue.content);
    } catch (error) {
      console.log(error);
    }
  },
});

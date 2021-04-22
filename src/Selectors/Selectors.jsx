import { selector } from "recoil";
import {windowTitleAtom, contentAtom} from "../store/Store";



export const JsonPreviewSelector = selector({
    key: 'JsonPreviewSelector',
    get: ({get}) => {
      const titleWrapper = get(windowTitleAtom);
      const contentWrapper = get(contentAtom);
        try{
            return {
                title: titleWrapper,
                content: contentWrapper,
            };
        }catch(error){
            console.log(error.message);
        }

      }
    },
  );


import { selector } from "recoil";
import {windowTitleAtom, contentAtom} from "../Atoms/atoms";



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

//   export const JsonEditorSelector = selector({
//     key: 'JsonEditorSelector',
//     get: ({get}) => {
//       const titleWrapper = get(windowTitleAtom);
//       const contentWrapper = get(contentAtom);
//       let newWrapper = {
//         title: titleWrapper,
//         content: contentWrapper,
//       };
//       return JSON.stringify(newWrapper);
//       },

//       set: ({set, get}, newJsonValue) => {


//         // let newUsdValue = newEurValue / exchangeRate;
//         // const commissionEnabled = get(commissionEnabledAtom);

//         // if(commissionEnabled){
//         //     const commission = get(commissionAtom);
//         //     newUsdValue = removeCommission(newUsdValue, commission);
//         // }


//         set(windowTitleAtom, newUsdValue)
//     }
// });
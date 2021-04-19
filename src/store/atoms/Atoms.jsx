import { atom } from "recoil"
import FieldForm from "../../Components/Forms/Section/Field/FieldForm"

//Containing fieldForm components
export const fieldFormListAtom = atom({
    key: 'fieldFormListAtom',
    default: [
      <FieldForm />,
    ]
})

//Containing form data of fieldforms
export const fieldFormDataAtom = atom({
    key: 'fieldFormDataAtom',
    default: []
})
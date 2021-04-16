import { useState } from "react";
import { atom, selector, useRecoilValue } from "recoil";
import "./App.css";
import FormWrapper from "./Components/Forms/FormWrapper";

export const fieldFormListState = atom({
    key: "fieldFormListState",
    default: [],
})

export const fieldFormDatasState = atom({
    key: "fieldFormDatasState",
    default: [{
        id: 1000,
        type: "1",
        label: "hello"
    }],
})

export const fieldFormDatasJsonState = selector({
    key: 'fieldFormDatasJsonState',
    get: ({get}) => {
        const data = get(fieldFormDatasState)

        return data
    }
})

function App() {
  
  const jsonData = useRecoilValue(fieldFormDatasJsonState)

  return (
    <div className="App">
      <FormWrapper  />

      {/* This is just a placeholder */}

      <pre>{JSON.stringify(jsonData)}</pre>
    </div>
  );
}

export default App;

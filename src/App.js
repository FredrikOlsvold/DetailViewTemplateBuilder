import { useRecoilValue } from "recoil";
import "./App.css";
import Menu from "./Components/Appbar/Menu";
import ContainerContent from "./Components/Containers/ContainerContent";
import ContainerWindowTitle from "./Components/Containers/ContainerWindowTitle";
import FormWrapper from "./Components/Forms/FormWrapper";
import { fieldFormDataAtom } from "./store/atoms/Atoms";

function App() {
  const fieldFormData = useRecoilValue(fieldFormDataAtom);

  return (
    <div className="App">
      <Menu />
      <ContainerWindowTitle />
      <ContainerContent />
      

      <pre>{JSON.stringify(fieldFormData)}</pre>
    </div>
  );
}

export default App;

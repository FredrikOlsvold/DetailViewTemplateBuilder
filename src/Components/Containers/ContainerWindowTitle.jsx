import React, { useState } from "react";
import FieldForm from "../Forms/Section/Field/FieldForm";
import FormWrapper from "../Forms/FormWrapper";
import SectionForm from "../Forms/Section/SectionForm";

export default function ContainerWindowTitle() {
  //const [fieldFormComponents, setFieldFormComponents] = useState([])
  const fieldCounter = 1;
  return (
    <div>
      <FormWrapper section="title">
        <SectionForm fieldCounter={fieldCounter} containerType="title" />
      </FormWrapper>
    </div>
  );
}

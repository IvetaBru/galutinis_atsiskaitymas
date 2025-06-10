import Label from "../atoms/Label";
import Input from "../atoms/Input";
import { InputFieldProps } from "../../../types";

type Props = Omit<InputFieldProps, 'labelFor'>;

const InputField = ({ labelText, inputId, inputName, inputOnBlur, inputOnChange, inputType, inputValue, errors, touched }: Props) => {
    return ( 
        <div>
            <div>
                <Label
                    labelFor={inputId}
                    labelText={labelText}
                />
                <Input
                    inputType={inputType}
                    inputId={inputId}
                    inputName={inputName}
                    inputValue={inputValue}
                    inputOnBlur={inputOnBlur}
                    inputOnChange={inputOnChange}
                />
            </div>
            {
                errors && touched && <p>{errors}</p>
            }
        </div>
     );
}
 
export default InputField;
export type User = {
  _id: string,
  username: string,
  fullNmae: string,
  email: string,
  password: string,
  passwordRepeat?: string,
  avatar: string,
};


export type InputFieldProps = {
  inputType: string, 
  inputName: string,
  inputId: string,
  inputValue: string | number,
  inputOnChange: React.ChangeEventHandler<HTMLInputElement>,
  inputOnBlur: React.FocusEventHandler<HTMLInputElement>,
  labelFor: string,
  labelText: string,
  touched: boolean | undefined,
  errors: string | undefined
};
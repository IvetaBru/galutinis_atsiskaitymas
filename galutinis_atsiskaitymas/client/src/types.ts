export type ChildrenElementProp = { children: React.ReactElement };
export type ChildrenNodeProp = { children: React.ReactNode };

export type User = {
    _id: string,
    username: string,
    fullNmae: string,
    email: string,
    password: string,
    passwordRepeat?: string,
    avatar: string,
};

export type UserContextReducerActions = 
    { type: 'setUser', user: Omit<User, 'password'> } |
    { type: 'logUserOut' } |
    { type: 'editUser', key: keyof Omit<User, 'password'|'_id'>, newValue: string | number };

export type UserContextType = {
    loggedInUser: Omit<User, "password"> | null,
    login: ({ username, password }: Pick<User, "username" | "password">) => Promise<{ error: string } | { success: string }>,
    logOut: () => void
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
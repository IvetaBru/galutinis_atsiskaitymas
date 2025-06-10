import { createContext, useReducer } from "react";

import { ChildrenElementProp, User, UserContextReducerActions, UserContextType } from "../types";

const reducer = (state: Omit<User, 'password'> | null, action: UserContextReducerActions ) : Omit<User, 'password'> | null => {
    switch(action.type){
        case 'setUser':
            return action.user;
        case 'logUserOut':
            return null;
        case 'editUser':
            return state ? {
                ...state,
                [action.key] : action.newValue
            } : state;
    }
}

const UsersContext = createContext<UserContextType | undefined>(undefined);
const UsersProvider = ({ children } : ChildrenElementProp) => {

    const [loggedInUser, dispatch] = useReducer(reducer, null);

    type BackLoginResponse = { error: string } | { success: string, userData: Omit<User, 'password'> };

    const login = async (loginInfo: Pick<User, 'username' | 'password'>) => {
        const Back_Response = await fetch(`http://localhost:5500/users/login`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(loginInfo)
        }).then(headers => headers.json()) as BackLoginResponse;
        if('error' in Back_Response){
            return { error: Back_Response.error };
        }
        dispatch({
            type: "setUser",
            user: Back_Response.userData
        });
        return { success: Back_Response.success };
    }

    const logOut = () => {
        dispatch({
            type: "logUserOut"
        });
    }

    const register = async (registerInfo: Omit<User, '_id'>) => {
        const Back_Response = await fetch(`http://localhost:5500/users/register`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(registerInfo) 
        }).then(res => res.json());
        if('error' in Back_Response){
            return { error: Back_Response.error };
        }
        dispatch({
            type: 'setUser',
            user: Back_Response.user
        });
        return { success: Back_Response.success }
    }

    return(
        <UsersContext.Provider
            value={{
                loggedInUser,
                login,
                logOut,
                register
            }}
        >
            { children }
        </UsersContext.Provider>
    )
}

export { UsersProvider };
export default UsersContext;
import { createContext, useEffect, useReducer } from "react";

import { ChildrenElementProp, User, UserContextReducerActions, UserContextType } from "../types";
import { useNavigate } from "react-router";

const reducer = (state: Omit<User, 'password'> | null, action: UserContextReducerActions ) : Omit<User, 'password'> | null => {
    switch(action.type){
        case 'setUser':
            return action.user;
        case 'logUserOut':
            return null;
        case 'editUser':
            return state ? {
                ...state,
                ...action.user
            } : state;
    }
}

const UsersContext = createContext<UserContextType | undefined>(undefined);
const UsersProvider = ({ children } : ChildrenElementProp) => {

    const [loggedInUser, dispatch] = useReducer(reducer, null);
    const navigate = useNavigate();

    const login = async (loginInfo: Pick<User, 'username' | 'password'>, keepLoggedIn: boolean) => {
        try{
            const Back_Response = await fetch(`http://localhost:5500/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(loginInfo)
        });
        const data = await Back_Response.json();
        if ('error' in data){
            return { error: data.error };
        }
        const jwt = data.accessJWT || Back_Response.headers.get("Authorization");
        if(jwt){
            if(keepLoggedIn){
                localStorage.setItem('accessJWT', jwt);
            }else{
                sessionStorage.setItem('accessJWT', jwt);
            }
        }
        dispatch({
            type: "setUser",
            user: data.userData
        });
        return { success: data.success };
        }catch{
            return { error: 'Login failed, please try again'};
        }
    }

    const logOut = () => {
        localStorage.removeItem('accessJWT');
        sessionStorage.removeItem('accessJWT');
        dispatch({
            type: 'logUserOut'
        });
    }

    const register = async (registerInfo: Omit<User, '_id'>) => {
        const Back_Response = await fetch(`http://localhost:5500/users/register`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(registerInfo) 
        }).then(res => {
            const authHeader = res.headers.get('Authorization');
            if(authHeader !== null){
                sessionStorage.setItem('accessJWT', authHeader);
            }
            return res.json();

        });
        if('error' in Back_Response){
            return { error: Back_Response.error };
        }
        dispatch({
            type: 'setUser',
            user: Back_Response.userData
        });
        return { success: Back_Response.success }
    }

    const editUserInfo = async (editedUser: User) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/users/editInfo`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessJWT}`
            },
            body: JSON.stringify(editedUser)
        })
        const data = await backResponse.json();

        if ('error' in data){
            return { error: data.error };
        }
        dispatch({
            type: "setUser",
            user: data.user
        });
        return { success: data.success };
    }

    useEffect(() => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        if(accessJWT){
            fetch(`http://localhost:5500/users/loginAuto`, {
                headers: {
                    Authorization: `Bearer ${accessJWT}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if('error' in data){
                    //modal about error
                    localStorage.removeItem('accessJWT');
                    setTimeout(() => navigate('/login'), 3000);
                }else{
                    dispatch({
                        type: "setUser",
                        user: data
                    });
                }
            })
        }
    }, [navigate]);

    return(
        <UsersContext.Provider
            value={{
                loggedInUser,
                login,
                logOut,
                register,
                editUserInfo
            }}
        >
            { children }
        </UsersContext.Provider>
    )
}

export { UsersProvider };
export default UsersContext;
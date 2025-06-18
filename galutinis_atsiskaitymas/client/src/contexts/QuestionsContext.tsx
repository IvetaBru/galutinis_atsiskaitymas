import { createContext, useEffect, useReducer, useState } from "react";

import { Question, ChildrenElementProp, QuestionActionTypes, QuestionsContextType } from "../types";
import { useNavigate } from "react-router";

const reducer = (state: Question[], action: QuestionActionTypes): Question[] => {
    switch(action.type){
        case 'setData':
            return action.data;
        case 'addQuestion':
            return [...state, action.newQuestion];
        case 'deleteQuestion':
            return state.filter(q => q._id !== action._id);
        case 'editQuestion':
            return state.map(q =>
                q._id === action.editedQuestion._id ? action.editedQuestion : q
            );
        default:
            return state;
    }
}

const QuestionsContext = createContext<undefined | QuestionsContextType>(undefined);
const QuestionsProvider = ({ children }: ChildrenElementProp) => {

    const [questions, dispatch] = useReducer(reducer, []);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const refetchQuestions = async () => {
        setIsLoading(true);
        const res = await fetch("http://localhost:5500/questions");
        const data = await res.json();
        dispatch({ type: "setData", data });
        setIsLoading(false);
    };

    const addNewQuestion = async (newQuestion: Pick<Question, 'title' | 'body' | 'tags'>) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${accessJWT}`
            },
            body: JSON.stringify(newQuestion)
        });
        const data = await backResponse.json();
        if('error' in data){
            return { error: data.error };
        }
        dispatch({
            type: "addQuestion",
            newQuestion: data.newQuestion
        });
        return { success: data.success };
    }

    const deleteQuestion = (_id: Question['_id']) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const confirm = window.confirm("Do you want to delete it?");
        if (!confirm) return;

        fetch(`http://localhost:5500/questions/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`
            },
        })
        .then(() => {
            dispatch({
                type: "deleteQuestion",
                _id
            });
            navigate('/questions')
        });
    }

    const editQuestion = async (editedQuestion: Question) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions/${editedQuestion._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessJWT}`
            },
            body: JSON.stringify(editedQuestion)
        })
        const data = await backResponse.json();

        if ('error' in data){
            return { error: data.error };
        }
        dispatch({
            type: "editQuestion",
            editedQuestion
        });
        return { success: data.success };
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:5500/questions`)
            .then(res => res.json())
            .then((data: Question[]) => {
                dispatch({
                    type: "setData",
                    data
                });
                setIsLoading(false);
            });
    }, []);

    return(
        <QuestionsContext.Provider
            value={{
                refetchQuestions,
                questions,
                dispatch,
                isLoading,
                addNewQuestion,
                deleteQuestion,
                editQuestion
            }}
        >
            { children }
        </QuestionsContext.Provider>
    )
}

export { QuestionsProvider };
export default QuestionsContext;
import { createContext, useEffect, useReducer, useState } from "react";
// import { useNavigate } from "react-router";

import { ChildrenElementProp, Answer, AnswerActionTypes, AnswersContextType } from "../types";

const reducer = (state: Answer[], action: AnswerActionTypes): Answer[] => {
    switch(action.type){
        case 'setData':
            return action.data;
        case 'addAnswer':
            return [...state, action.newAnswer];
        case 'deleteAnswer':
            return state.filter(q => q._id !== action._id);
        case 'editAnswer':
            return state.map(answer =>
                answer._id === action.editedAnswer._id ? action.editedAnswer : answer
            );
        default:
            return state;
    }
}

type Props =  ChildrenElementProp & {
    questionId?: string
}

const AnswersContext = createContext<undefined | AnswersContextType>(undefined);
const AnswersProvider = ({ children, questionId }: Props) => {

    const [ answers, dispatch ] = useReducer(reducer, []);
    const [answerIsLoading, setAnswerIsLoading] = useState(true);
    // const navigate = useNavigate();

    const addNewAnswer = async (newAnswer: Pick<Answer, 'body'>) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/question/${questionId}/answers`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${accessJWT}`
            },
            body: JSON.stringify(newAnswer)
        });
        const data = await backResponse.json();
        if('error' in data){
            return { error: data.error };
        }
        dispatch({
            type: "addAnswer",
            newAnswer: data.newAnswer
        });
        return { success: data.success };
    };

    const deleteAnswer = (_id: Answer['_id']) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const confirm = window.confirm("Do you want to delete it?");
        if (!confirm) return;
    
        fetch(`http://localhost:5500/answers/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`
            },
        })
        .then(() => {
            dispatch({
                type: "deleteAnswer",
                _id
            });
            // navigate('/questions')
        });
    }
    const editAnswer = async (editedAnswer: Answer) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/answers/${editedAnswer._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessJWT}`
            },
            body: JSON.stringify(editedAnswer)
        })
        const data = await backResponse.json();

        if ('error' in data){
            return { error: data.error };
        }
        dispatch({
            type: "editAnswer",
            editedAnswer
        });
        return { success: data.success };
    }

    useEffect(() => {
        setAnswerIsLoading(true);
        fetch(`http://localhost:5500/questions/${questionId}/answers`)
            .then(res => res.json())
            .then((data: Answer[]) => {
                dispatch({
                    type: "setData",
                    data
                });
                setAnswerIsLoading(false);
            });
    }, [questionId]);    

    return(
        <AnswersContext.Provider
            value={{
                answers,
                dispatch,
                answerIsLoading,
                addNewAnswer,
                deleteAnswer,
                editAnswer
            }}
        >
            { children }
        </AnswersContext.Provider>
    )
}

export { AnswersProvider };
export default AnswersContext;
import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { ChildrenElementProp, Answer, AnswerActionTypes, AnswersContextType, QuestionsContextType } from "../types";
import QuestionsContext from "./QuestionsContext";

const reducer = (state: Answer[], action: AnswerActionTypes): Answer[] => {
    switch(action.type){
        case 'setData':
            return action.data;
        case 'addAnswer':
            return [...state, action.newAnswer];
        case 'deleteAnswer':
            return state.filter(q => q._id !== action._id);
        case 'editAnswer':
            if (!action.editedAnswer || !action.editedAnswer._id) return state;
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
    const [ answerIsLoading, setAnswerIsLoading ] = useState(true);
    const { refetchQuestions } = useContext(QuestionsContext) as QuestionsContextType;

    const addNewAnswer = async (newAnswer: Pick<Answer, 'body'>) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions/${questionId}/answers`, {
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
        await refetchQuestions();
        return { success: data.success };
    };

    const deleteAnswer = async (_id: Answer['_id']) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions/answers/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`
            },
        });
        if(!backResponse.ok){
            const data = await backResponse.json();
            return { error: data.error }
        }
        dispatch({
            type: "deleteAnswer",
            _id
        });
        await refetchQuestions();
    }

    const editAnswer = async (editedAnswer: Answer) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions/answers/${editedAnswer._id}`, {
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
            editedAnswer: data.updatedAnswer
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
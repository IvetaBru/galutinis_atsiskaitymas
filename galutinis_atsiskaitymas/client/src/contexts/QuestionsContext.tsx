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

    const addNewQuestion = (newQuestion: Question) => {
        fetch(`http://localhost:5500/questions`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newQuestion)
        });
        dispatch({
            type: "addQuestion",
            newQuestion
        });
    }

    const deleteQuestion = (_id: Question['_id']) => {
        const confirm = window.confirm("Do you want to delete it?");
        if (!confirm) return;

        fetch(`http://localhost:5500/questions/${_id}`, {
            method: "DELETE"
        })
        .then(() => {
            dispatch({
                type: "deleteQuestion",
                _id
            });
            navigate('questions')
        });
    }

    const editQuestion = (editedQuestion: Question) => {
        fetch(`http://localhost:5500/questions/${editedQuestion._id}`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(editedQuestion)
        })
        .then(res => {
            if(!res.ok) throw new Error('Update failed');
            return res.json();
        })
        .then(() => {
            dispatch({
                type: "editQuestion",
                editedQuestion
            });
            navigate('questions');
        })
        .catch(err => {
            console.log('Failed', err);
            alert("Something went wrong");
        });
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
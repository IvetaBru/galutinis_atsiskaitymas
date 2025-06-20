import { createContext, useEffect, useReducer, useRef, useState } from "react";

import { Question, ChildrenElementProp, QuestionActionTypes, QuestionsContextType } from "../types";
import { useNavigate } from "react-router";

const reducer = (state: Question[], action: QuestionActionTypes): Question[] => {
    switch(action.type){
        case 'setData':
            return action.data;
        case 'addQuestion':
            return [action.newQuestion, ...state];
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

    const sort = useRef('sort_createdAt=-1');
    const filter = useRef('');
    const [pageSize, setPageSize] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDataAmount, setFilteredDataAmount] = useState(0);

    const changePageSize = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
        getFilteredDataAmount();
    }
    
    const changePage = (newPage: number) => {
        setCurrentPage(newPage);
    }
    
    const changeSort = (sortValue: string) => {
        sort.current = sortValue;
        setCurrentPage(1);
        getFilteredDataAmount();
        fetchData(); 
    }
    
    const changeFilter = (filterValue: string) => {
        filter.current = filterValue;
        fetchData(); 
    }

    const getFilteredDataAmount = () => {
        fetch(`http://localhost:5500/questions/getCount?${filter.current}`)
        .then(res => res.json())
        .then(data => {
            setFilteredDataAmount(data.totalAmount);
        });
    }

    const fetchData = async () => {
    setIsLoading(true);
    const skip = (currentPage - 1) * pageSize;
    const query = `skip=${skip}&limit=${pageSize}&${sort.current}&${filter.current}`;
        fetch(`http://localhost:5500/questions?${query}`)
          .then(res => res.json())
          .then(data => {
            dispatch({
              type: 'setData',
              data
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
    }

    const refetchQuestions = async () => {
        await fetchData();
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
    fetchData();
    getFilteredDataAmount();
    }, [pageSize, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchData();
        getFilteredDataAmount();
    }, [filter.current, sort.current]);

    return(
        <QuestionsContext.Provider
            value={{
                changePageSize,
                changePage,
                currentPage,
                pageSize,
                changeSort,
                changeFilter,
                filteredDataAmount,
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
import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "react-router";

import { Question, ChildrenElementProp, QuestionActionTypes, QuestionsContextType } from "../types";

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
    const sort = useRef('sort_createdAt=-1');
    const location = useLocation();
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
        setCurrentPage(1);
        fetchData(); 
        getFilteredDataAmount();
    }

    const getFilteredDataAmount = async () => {
        const res = await fetch(`http://localhost:5500/questions/getCount?${filter.current}`)
        const data = await res.json();   
        setFilteredDataAmount(data.totalAmount);
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
        setCurrentPage(1);
        await refetchQuestions();
        await getFilteredDataAmount();
        return { success: data.success };
    }

    const deleteQuestion = async (_id: Question['_id']) => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        const backResponse = await fetch(`http://localhost:5500/questions/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessJWT}`
            }
        });
        const data = await backResponse.json();
        if('error' in data){
            return { error: data.error };
        } 
        dispatch({
            type: "deleteQuestion",
            _id
        });
        setCurrentPage(1);
        await refetchQuestions();
        await getFilteredDataAmount();
        return { success: data.success };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchData();
        getFilteredDataAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.current, sort.current]);

    useEffect(() => {
    if (!location.pathname.startsWith("/questions")) {
        filter.current = '';
        setCurrentPage(1);
        fetchData();
        getFilteredDataAmount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

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
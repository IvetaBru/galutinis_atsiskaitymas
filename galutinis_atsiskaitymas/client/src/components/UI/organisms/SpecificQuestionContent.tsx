import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { AnswersContextType, Question, QuestionsContextType, UserContextType } from "../../../types";
import UsersContext from "../../../contexts/UsersContext";
import EditingQuestion from "../molecules/EditingQuestion";
import AnswersContext from "../../../contexts/AnswersContext";
import AnswerInput from "../molecules/AnswerInput";
import EditingAnswer from "../molecules/EditingAnswer";

const StyledSection = styled.section`
    padding: 20px 200px;
    font-weight: 600;
    @keyframes glow {
        0% {
        box-shadow: 0 0 5px var(--color-accent), 0 0 10px var(--color-accentText);
        }
        50% {
        box-shadow: 0 0 20px var(--color-accentText), 0 0 30px var(--color-accent);
        }
        100% {
        box-shadow: 0 0 5px var(--color-accent), 0 0 10px var(--color-accentText);
        }
    }
    .container{
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        margin: 20px;
        border-radius: 40px;
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);

    }
    .buttons{
        display: flex;
        gap: 10px;
        padding-bottom: 20px;
    }
    .edit, .delete{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        font-weight: 600;
        box-shadow: 0 1px 2px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    .edit:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }  
    .delete:hover, .cancel:hover{
        background-color: #cc7e7e;
        transition: 0.3s;
    }
    .dates{
        display: flex;
        gap: 10px;
        align-items: baseline;
        >span{
            font-weight: 600;
        }
        >.isEdited{
            font-style: italic;
            font-size: 12px;
            color: var(--color-secondary);
        }
    }
    .name{
        font-weight: 600;
        font-style: italic;
        color: var(--color-secondary);
    }
    .tags{
        margin-bottom: 15px;
        >span{
            background-color: var(--color-secondary);
            color: var(--color-primary);
            border-radius: 10px;
            padding: 1px 10px;
            margin-right: 8px;
        }
    }
    .answer{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        margin: 20px 0px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        font-family: "Nunito", sans-serif;
        cursor: pointer;
        animation: glow 2s infinite ease-in-out;
    }
    .answer:hover{
        color: var(--color-accentText);
    }
    .oneAnswer{
        padding: 20px;
        border-radius: 40px;
        box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 0px) and (max-width: 767px) {
        padding: 20px;
    }
    @media (min-width: 768px) and (max-width: 1080px) {
        padding: 20px 100px;
    }
`

const SpecificQuestionContent = () => {

    const navigate = useNavigate();
    const {_id} = useParams();
    const { questions, isLoading, deleteQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const { answers, answerIsLoading, deleteAnswer } = useContext(AnswersContext) as AnswersContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;

    const [isQuestionLoading, setIsQuestionLoading] = useState(true);
    const [ question, setQuestion ] = useState<Question | null>(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        if (!_id) {
        setQuestion(null);
        setIsQuestionLoading(false);
        return;
    }
        setIsQuestionLoading(true);
        if (!isLoading && questions.length) {
            const found = questions.find(q => q._id === _id);
            if (found) {
                setQuestion(found);
                setIsQuestionLoading(false);
                return;
            }
        }
        fetch(`http://localhost:5500/questions/${_id}`)
        .then(res => {
            if (res.status === 404) {
                navigate('/questions');
                return null;
            }
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data) {
                setQuestion(data);
            }
        })
        .catch(err => {
            console.error('Question fetch error:', err.message);
            setQuestion(null);
            navigate('/questions');
        })
        .finally(() => setIsQuestionLoading(false));
    }, [_id, questions, isLoading, navigate]);

    return ( 
        <StyledSection>
            <div className="container">
                {
                    question && question.authorId === loggedInUser?._id && (
                    <div className="buttons">
                        <button onClick={() => deleteQuestion(question._id)} className="delete">Delete</button>
                        <button onClick={() => setIsEditing((prev) => !prev)} className={`edit ${isEditing ? "cancel" : ""}`}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                )}
                {
                    isQuestionLoading ? <p>Data is loading...</p> :
                    !question ? <p>Question not found</p> :
                    isEditing && question.authorId === loggedInUser?._id ? (
                        <EditingQuestion question={question} 
                            onClose={() => {
                                setIsEditing(false);
                                fetch(`http://localhost:5500/questions/${_id}`)
                                .then(res => res.json())
                                .then(data => setQuestion(data));
                            }} 
                            />
                    ) : (
                        <div>
                            <div className="dates">
                                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                {
                                    question.isEdited && (
                                        <span className="isEdited">Edited {new Date (question.updatedAt).toLocaleDateString()}</span>
                                    )
                                }
                            </div>
                            <p className="name">{question.authorUsername} asked:</p>
                            <h3>{question.title}</h3>
                            <p>{question.body}</p>
                            <p className="tags">{question.tags.map((tag, index) => (
                                <span key={index}>{tag}</span>
                            ))}</p>
                        </div>
                    )
                }
            </div>
            <div className="container">
                {
                    loggedInUser && (
                        <button onClick={() => setIsOpen(true)} className="answer">Answer</button>
                )}
                <AnswerInput isOpen={isOpen} onClose={() => setIsOpen(false)}/>
                {
                    answerIsLoading ? (<p>Answers are loading...</p>) :
                    answers.length > 0 ? (
                            answers.map(answer => (
                                <div key={answer._id}>
                                {
                                    editingAnswerId && editingAnswerId === answer._id ? (
                                        <EditingAnswer
                                        answer={answer}
                                        onClose={() => {
                                            setEditingAnswerId(null);
                                        }}
                                    />
                                ) : (
                                    <div className="oneAnswer">
                                        <div className="dates">
                                            <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                                            {
                                                answer.isEdited && (
                                                    <span className="isEdited">Edited {new Date(answer.updatedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <p className="name">{answer.authorUsername} answered:</p>
                                        <p>{answer.body}</p>
                                        {
                                            answer.authorId === loggedInUser?._id && (
                                                <div className="buttons">
                                                    <button onClick={() => deleteAnswer(answer._id)} className="delete">Delete</button>
                                                    {
                                                    editingAnswerId !== answer._id && (
                                                        <button onClick={() => setEditingAnswerId(answer._id)} className="edit">Edit</button>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                            ))
                        ) : (<p>No answers yet</p>)
                    }
            </div>
        </StyledSection>
    );
}
 
export default SpecificQuestionContent;
import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { AnswersContextType, Question, QuestionsContextType, UserContextType } from "../../../types";
import UsersContext from "../../../contexts/UsersContext";
import EditingQuestion from "../molecules/EditingQuestion";
import AnswersContext from "../../../contexts/AnswersContext";
import AnswerInput from "../molecules/AnswerInput";
import EditingAnswer from "../molecules/EditingAnswer";

const StyledSection = styled.section`
    
`

const SpecificQuestionContent = () => {

    const {_id} = useParams();
    const { questions, isLoading, deleteQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const { answers, answerIsLoading, deleteAnswer } = useContext(AnswersContext) as AnswersContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;

    const [ question, setQuestion ] = useState<Question | null>(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        if(!isLoading && questions.length){
            const found = questions.find(q => q._id === _id);
            setQuestion(found || null);
        }
    }, [_id, questions, isLoading]);

    return ( 
        <StyledSection>
            <div>
                {
                    question && question.authorId === loggedInUser?._id && (
                    <>
                        <button onClick={() => deleteQuestion(question._id)}>Delete</button>
                        <button onClick={() => setIsEditing((prev) => !prev)}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </>
                )}
                {
                    isLoading ? <p>Data is loading...</p> :
                    !question ? <p>Question not found</p> :
                    isEditing && question.authorId === loggedInUser?._id ? (
                        <EditingQuestion question={question} onClose={() => setIsEditing(false)} />
                    ) : (
                        <div>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                            {
                                question.isEdited && (
                                    <span>Edited {new Date (question.updatedAt).toLocaleDateString()}</span>
                                )
                            }
                            <p>{question.authorUsername}</p>
                            <h3>{question.title}</h3>
                            <p>{question.body}</p>
                            <p>{question.tags.join(' | ')}</p>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    loggedInUser && (
                        <button onClick={() => setIsOpen(true)}>Answer</button>
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
                                        onClose={() => setEditingAnswerId (null)}
                                    />
                                ) : (
                                    <>
                                        <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                                        {
                                            answer.isEdited && (
                                                <span>Edited {new Date(answer.updatedAt).toLocaleDateString()}</span>
                                        )}
                                        <p>{answer.authorUsername}</p>
                                        <p>{answer.body}</p>
                                        {
                                            answer.authorId === loggedInUser?._id && (
                                                <>
                                                    <button onClick={() => deleteAnswer(answer._id)}>Delete</button>
                                                    {
                                                    editingAnswerId !== answer._id && (
                                                        <button onClick={() => setEditingAnswerId(answer._id)}>Edit</button>
                                                    )}
                                                </>
                                            )
                                        }
                                    </>
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
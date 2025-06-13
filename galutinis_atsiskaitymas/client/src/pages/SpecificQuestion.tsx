import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";

import QuestionsContext from "../contexts/QuestionsContext";
import { Question, QuestionsContextType, UserContextType } from "../types";
import UsersContext from "../contexts/UsersContext";
import EditingQuestion from "../components/UI/molecules/EditingQuestion";

const StyledSection = styled.section`
    
`

const SpecificQuestion = () => {

    const { _id } = useParams();
    const { questions, isLoading, deleteQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;

    const [ question, setQuestion ] = useState<Question | null>(null);
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        if(!isLoading && questions.length){
            const found = questions.find(q => q._id === _id);
            setQuestion(found || null);
        }
    }, [_id, questions, isLoading])

    return ( 
        <StyledSection>
            {
                question && question.authorId === loggedInUser?._id && 
                <>
                    <button onClick={() => deleteQuestion(question._id)}>Delete</button>
                    <button onClick={() => setIsEditing((prev) => !prev)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </>
            }
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
                        {
                            question.isAnswered ? 
                            <div>
                                <p>[Answers will go here]</p>
                            </div> : <p>No answers yet</p>
                        }
                    </div>
                )
            }
        </StyledSection>
     );
}
 
export default SpecificQuestion;
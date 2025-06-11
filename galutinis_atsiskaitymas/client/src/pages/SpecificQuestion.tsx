import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";

import QuestionsContext from "../contexts/QuestionsContext";
import { Question, QuestionsContextType } from "../types";

const StyledSection = styled.section`
    
`

const SpecificQuestion = () => {

    const { _id } = useParams();
    const { questions, isLoading } = useContext(QuestionsContext) as QuestionsContextType;

    const [ question, setQuestion ] = useState<Question | null>(null);

    useEffect(() => {
        if(!isLoading && questions.length){
            const found = questions.find(q => q._id === _id);
            setQuestion(found || null);
        }
    }, [_id, questions, isLoading])

    return ( 
        <StyledSection>
            {
                isLoading ? <p>Data is loading...</p> :
                !question ? <p>Question not found</p> :
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
                    {
                        question.isAnswered ? 
                        <div>
                            <p>[Answers will go here]</p>
                        </div> : <p>No answers yet</p>
                    }
                </div>
            }
        </StyledSection>
     );
}
 
export default SpecificQuestion;
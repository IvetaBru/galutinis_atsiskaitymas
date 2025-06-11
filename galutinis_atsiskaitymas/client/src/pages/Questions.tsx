import styled from "styled-components";
import { useContext } from "react";

import QuestionsContext from "../contexts/QuestionsContext";
import { QuestionsContextType } from "../types";
import QuestionCard from "../components/UI/molecules/QuestionCard";

const StyledSection = styled.section`
    
`

const Questions = () => {

    const { questions, isLoading } = useContext(QuestionsContext) as QuestionsContextType;
    const isEmpty = questions.length === 0;
    
    return ( 
        <StyledSection>
            <h2>Questions</h2>
            <div>
                {
                    !isLoading && isEmpty && (
                        <p>No questions yet</p>
                    )
                }
                {
                    !isLoading && !isEmpty && questions.map(question => (
                        <QuestionCard
                            data={question}
                            key={question._id}
                        />
                    ))
                }
            </div>
            
        </StyledSection>
     );
}
 
export default Questions;
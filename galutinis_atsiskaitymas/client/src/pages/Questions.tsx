import styled from "styled-components";
import { useContext } from "react";
import { Link } from "react-router";

import QuestionsContext from "../contexts/QuestionsContext";
import UsersContext from "../contexts/UsersContext";
import { QuestionsContextType, UserContextType } from "../types";
import QuestionCard from "../components/UI/molecules/QuestionCard";
import QuestionsSort from "../components/UI/molecules/QuestionsSort";
import QuestionsFilter from "../components/UI/molecules/QuestionsFilter";
import Pagination from "../components/UI/molecules/Pagination";
import PageSize from "../components/UI/atoms/PageSize";

const StyledSection = styled.section`
    
`

const Questions = () => {

    const { questions, isLoading } = useContext(QuestionsContext) as QuestionsContextType;
    const { loggedInUser } = useContext(UsersContext) as UserContextType;
    const isEmpty = questions.length === 0;
    
    return ( 
        <StyledSection>
            <h2>Questions</h2>
            {
                loggedInUser ? 
                <Link to={'/questions/ask'}><button>Ask Question</button></Link> :
                <Link to={'/login'}><button>Ask Question</button></Link>
            }
            <QuestionsSort/>
            <QuestionsFilter/>
            <PageSize />
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
            <Pagination />  
        </StyledSection>
     );
}
 
export default Questions;
import styled from "styled-components";

import { Question } from "../../../types";

type Props = {
    data: Question
}

const StyledDiv = styled.div`
    border: 2px white solid;
    
`

const QuestionCard = ({ data }: Props) => {

    return ( 
        <StyledDiv>
            <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            <p>{data.authorUsername}</p>
            <h3>{data.title}</h3>
            <p>{data.body}</p> 
            <span>Answers: {data.answersCount}</span>
        </StyledDiv>
     );
}
 
export default QuestionCard;
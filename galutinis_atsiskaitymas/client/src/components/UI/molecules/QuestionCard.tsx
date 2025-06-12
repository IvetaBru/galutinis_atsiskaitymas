import styled from "styled-components";
import { Link } from "react-router";

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
            <Link to={`/questions/${data._id}`}>
                <h3>{data.title}</h3>
            </Link>
            <p>{data.body}</p> 
            <span>Answers: {data.answersCount}</span>
            <p>{data.tags.join(' | ')}</p>
        </StyledDiv>
     );
}
 
export default QuestionCard;
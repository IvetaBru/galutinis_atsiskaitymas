import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router";

import { Question } from "../../../types";

type Props = {
    data: Question
}

const StyledDiv = styled.div`
    border: 2px white solid;
    
`

const QuestionCard = ({ data }: Props) => {

    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
    fetch(`http://localhost:5500/likes/count/${data._id}`)
        .then(res => res.json())
        .then(question => setLikesCount(question.likesCount))
        .catch(console.error);
    },[data._id]);

    return ( 
        <StyledDiv>
            <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            <span> Likes: {likesCount}</span>
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
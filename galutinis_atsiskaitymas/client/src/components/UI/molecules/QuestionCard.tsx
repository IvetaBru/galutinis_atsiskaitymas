import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Question, UserContextType } from "../../../types";
import UsersContext from "../../../contexts/UsersContext";

type Props = {
    data: Question
}

const StyledDiv = styled.div`
    border: 2px white solid;
    
`

const QuestionCard = ({ data }: Props) => {

    const { loggedInUser } = useContext(UsersContext) as UserContextType;
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const accessJWT = sessionStorage.getItem("accessJWT");

    useEffect(() => {
    fetch(`http://localhost:5500/likes/count/${data._id}`)
        .then(res => res.json())
        .then(question => setLikesCount(question.likesCount))
        .catch(console.error);

        if (accessJWT) {
        fetch(`http://localhost:5500/likes/user-liked/${data._id}`, {
        headers: {
            Authorization:`Bearer ${accessJWT}`
        }
        })
        .then(res => res.json())
        .then(data => setLiked(data.liked))
        .catch(console.error);
        } 
    },[data._id, accessJWT]);

    const toggleLike = () => {
    fetch(`http://localhost:5500/likes/toggle/${data._id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${accessJWT}`
        }
    })
        .then(res => res.json())
        .then(data => {
        setLiked(data.liked);
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
        })
        .catch(console.error);
    };

    return ( 
        <StyledDiv>
            <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            <div>
                {
                    loggedInUser ? 
                        (<button onClick={toggleLike}>
                            {liked ? <FavoriteIcon/> : <FavoriteBorderIcon />}
                            {likesCount}
                        </button>) : null
                }
            </div>
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
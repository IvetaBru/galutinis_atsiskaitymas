import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import styled from "styled-components";

import UsersContext from "../contexts/UsersContext";
import { UserContextType, Question } from "../types";
import EditingUserInfo from "../components/UI/molecules/EditingUserInfo";

const StyledSection = styled.section`
    padding: 20px 200px;
    color: var(--color-secondary);
    text-align: center;
    font-weight: 600;
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        border-radius: 40px;
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);
        margin-bottom: 20px;
    }
    
    .info, .likedQ{
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 20px 30px;
        width: 100%;
        >p{
            >img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
        }
        >div{
            >a{
                text-decoration: none;
                color: var(--color-secondary);
            }
        }
    }
    .likedQ{
        border-top: 2px var(--color-primary) solid;

    }
    .edit, .cancel{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        margin-bottom: 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    .edit:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    } 
    .cancel:hover{
        background-color: #cc7e7e;
        transition: 0.3s;
    } 
    .question{
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 40px;
        box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    .question:hover{
        background-color: var(--color-accent);
    }

    @media (min-width: 0px) and (max-width: 767px) {
        padding: 20px;
    }
    @media (min-width: 768px)  and (max-width: 1080px){
        padding: 20px 100px;
        .container{
            flex-direction: row;
        }
        .likedQ{
            border-left: 2px var(--color-primary) solid;
            border-top: none;
        }
    }
    @media (min-width: 1081px){
        padding: 20px 200px;
        .container{
            flex-direction: row;
        }
        .likedQ{
            border-left: 2px var(--color-primary) solid;
            border-top: none;
        }
    }
`

const UserInfo = () => {

    const { loggedInUser } = useContext(UsersContext) as UserContextType;
    const [favoriteQuestions, setFavoriteQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const accessJWT = localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT");
   
    const [ isEditing, setIsEditing ] = useState(false);

    useEffect(() => {
        if (!accessJWT) {
        setLoading(false);
        return;
        }
    fetch("http://localhost:5500/likes/liked-questions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessJWT}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if ("error" in data) {
          console.error("Klaida:", data.error);
        } else {
          setFavoriteQuestions(data.questions);
        }
      })
      .catch(err => {
        console.error("Serverio arba tinklo klaida:", err);
      })
      .finally(() => {
        setLoading(false);
    });
    }, [accessJWT]);

    if (!loggedInUser) {
        return <p>Loading user info or user not logged in</p>;
    }

    return (
        <StyledSection>
            <h2>Hello, {loggedInUser.fullName}!</h2>
            <div className="container">
                <div className="info">
                    <div>
                        <h3>Profile information</h3>
                        {
                            loggedInUser && (
                            <button onClick={() => setIsEditing((prev) => !prev)} className={`edit ${isEditing ? "cancel" : ""}`}>
                                {isEditing ? "Cancel" : "Edit"}
                            </button>)
                        }
                        {
                            isEditing && loggedInUser && (
                                <EditingUserInfo user={loggedInUser} onClose={() => setIsEditing(false)}/>
                            )
                        }
                    </div>
                    <p>Username: {loggedInUser.username}</p>
                    <p>Email: {loggedInUser.email}</p>
                    <p>Full name: {loggedInUser.fullName}</p>
                    <p>Avatar: <img src={loggedInUser.avatar} alt={loggedInUser.username} /></p>
                    <p>Profile created: {loggedInUser.createdAt ? new Date(loggedInUser.createdAt).toLocaleDateString() : "Unknown"}</p>
                </div>
                <div className="likedQ">
                    <h3>Liked questions</h3>
                    {
                        loading ? (<p>Loading...</p>) : 
                            favoriteQuestions.length > 0 ? (
                                <div>
                                    {
                                        favoriteQuestions.map(question => (
                                            <Link to={`/questions/${question._id}`} key={question._id}>
                                                <div className="question">
                                                    <h4>{question.title}</h4>
                                                    <p>{question.body}</p>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                        ) : (<p>No liked questions yet</p>)
                    }
                </div>
            </div>
        </StyledSection>
    );
};

export default UserInfo;
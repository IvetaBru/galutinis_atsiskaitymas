import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";

import UsersContext from "../contexts/UsersContext";
import { UserContextType, Question } from "../types";
import EditingUserInfo from "../components/UI/molecules/EditingUserInfo";


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
        <section>
                <h2>Hello, {loggedInUser.fullName}!</h2>
                <h3>Profile information</h3>
                {
                    loggedInUser && (
                    <button onClick={() => setIsEditing((prev) => !prev)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>)
                }
                {
                    isEditing && loggedInUser && (
                        <EditingUserInfo user={loggedInUser} onClose={() => setIsEditing(false)}/>
                    )
                }
            <div>
                <p>Username: {loggedInUser.username}</p>
                <p>Email: {loggedInUser.email}</p>
                <p>Full name: {loggedInUser.fullName}</p>
                <p>Avatar: <img src={loggedInUser.avatar} alt={loggedInUser.username} /></p>
                <p>Profile created: {new Date(loggedInUser.createdAt).toLocaleDateString()}</p>
            </div>
                <h3>Liked questions</h3>
            <div>
                {
                    loading ? (<p>Loading...</p>) : 
                        favoriteQuestions.length > 0 ? (
                            <div>
                                {
                                    favoriteQuestions.map(question => (
                                        <Link to={`/questions/${question._id}`} key={question._id}>
                                            <div>
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
        </section>
    );
};

export default UserInfo;
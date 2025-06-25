import styled from "styled-components";
import { Link } from "react-router";

const StyledSection = styled.section`
    padding: 20px 200px;
    min-height: calc(100vh - 80px);
    background-image: url("/images/Hero1.png");
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: contain;

    display: flex;
    flex-direction: column;
    justify-content: start;

    .logo{
        display: flex;
        justify-content: space-between;
        >img{
            width: 50%;
            margin-top: -150px;
            margin-bottom: -150px;
        }
    }
    .text{
        display: flex;
        flex-direction: column;
        width: 50%;
        padding: 50px 0;
        color: var(--color-secondary);
        font-weight: 600;
        >p{
            margin: 0;
            padding: 10px;
        }
    }
    .logReg{
        text-decoration: none;
        font-style: italic;
        color: var(--color-accentText);
    }
    @media (min-width: 0px) and (max-width: 599px) {
        padding: 20px;
        justify-content: start;
        .logo{
            >img{
                width: 50%;
                margin-top: -50px;
                margin-bottom: -50px;
            }
        }
        .text{
            width: 100%;
        }
    }
    @media (min-width: 600px) and (max-width: 767px) {
        padding: 20px;
        justify-content: start;
        .logo{
            >img{
                width: 50%;
                margin-top: -70px;
                margin-bottom: -150px;
            }
        }
        .text{
            width: 90%;
        }
    }
    @media (min-width: 768px) and (max-width: 1080px) {
        padding: 20px 100px;
        justify-content: start;
        .logo{
            >img{
                width: 70%;
                margin-bottom: -180px;
                max-width: 300px;
            }
        }
        .text{
            width: 70%;
        }
    }
    @media (min-width: 1081px) and (max-width: 1600px ){
        .text{
            width: 60%;
        }
        .logo{
            >img{
                    max-width: 300px;
                }
        }
    }
    @media (min-width: 1601px){
        justify-content: space-between;
        .text{
            color: var(--color-background);
        }
    }
`

const Home = () => {
    return ( 
        <StyledSection>
            <div className="logo">
                <img src="/images/TripTalk1.png" alt="logo" />
            </div>
            <div className="text">
                <p>Welcome to <b className="logReg">TripTalk</b> - your go-to place for travel questions and answers. Get advice, share experiences, and explore the world with fellow travelers.</p>
                <p><Link to='/login' className="logReg">Login</Link> to ask your question or help others by answering theirs and like questions to save them for later.</p>
                <p>Don't have an account? <Link to='/register' className="logReg">Register</Link> now and join the journey!</p>
            </div>
        </StyledSection>
     );
}
 
export default Home;
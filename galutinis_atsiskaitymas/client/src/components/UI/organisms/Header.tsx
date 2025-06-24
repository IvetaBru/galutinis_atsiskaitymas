import styled from 'styled-components';
import { NavLink, Link, useNavigate } from 'react-router';
import { useContext } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

import UsersContext from '../../../contexts/UsersContext';
import { UserContextType } from '../../../types';

const StyledHeader = styled.header`
    height: 80px;
    padding: 0 200px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo{
        width: 120px;
    }

    >nav{
        >ul{
            display: flex;
            gap: 50px;
            padding: 0;
            >li{
                list-style: none;
                >a{
                    text-decoration: none;
                    font-weight: 600;
                    color: var(--color-secondary);
                }
                >a.active, a:hover{
                    color: var(--color-accentText);
                }
            }
        }
    }
    .login{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        color: var(--color-secondary);
        >a{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
        }
        >.logout:hover{
            cursor: pointer;
            color: var(--color-accentText);
        }
    }
    .name{
        font-weight: 600;
        font-style: italic;
    }
    .photo{
        height: 30px;
        width: 30px;
        object-fit: cover;
        border-radius: 50%;
    }
    .questions{
    }

    @media (min-width: 0px) and (max-width: 767px) {
        padding: 20px;
        >nav{
            >ul{
                gap: 20px;
            }
        }
    }
    @media (min-width: 768px) and (max-width: 1080px) {
        padding: 20px 100px;
    }
    
`

const Header = () => {

    const { loggedInUser, logOut } = useContext(UsersContext) as UserContextType;
    const navigate = useNavigate();
    
    return ( 
        <StyledHeader>
            <div>
                <Link to='/'><h3><img src="../../../public/images/TripTalk.svg" alt="logo" className='logo'/></h3></Link>
            </div>
            <nav>
                <ul>
                    {
                        loggedInUser ? (
                            <li className='questions'><NavLink to='questions'>Questions</NavLink></li>
                        ):(
                        <>
                            <li><NavLink to='questions'>Questions</NavLink></li>
                            <li><NavLink to='/login'>Login</NavLink></li>
                            <li><NavLink to='/register'>Register</NavLink></li>   
                        </>
                        )
                    }
                </ul>
            </nav>    
                {
                    loggedInUser ? (
                        <div className='login'>
                            <Link to='user'>
                                <img 
                                    src={loggedInUser.avatar}
                                    alt={loggedInUser.username}
                                    className='photo'
                                />
                            </Link>
                            <span className='name'>{loggedInUser.fullName}</span>
                            <LogoutIcon 
                                onClick={() => {
                                logOut();
                                navigate('/');
                            }}
                            className='logout'
                        />
                        </div>
                    ) : null
                }
        </StyledHeader>
     );
}
 
export default Header;
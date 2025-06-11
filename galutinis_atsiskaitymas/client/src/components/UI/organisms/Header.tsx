import styled from 'styled-components';
import { NavLink, Link, useNavigate } from 'react-router';
import { useContext } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

import UsersContext from '../../../contexts/UsersContext';
import { UserContextType } from '../../../types';

const StyledHeader = styled.header`
    .photo{
        height: 40px;
        width: 40px;
        object-fit: cover;
        border-radius: 50%;
    }
    
`

const Header = () => {

    const { loggedInUser, logOut } = useContext(UsersContext) as UserContextType;
    const navigate = useNavigate();
    
    return ( 
        <StyledHeader>
            <div>
                <h3>Logo</h3>
            </div>
            <nav>
                <ul>
                    {
                        loggedInUser ? (
                            <li><NavLink to='questions'>Questions</NavLink></li>
                        ):(
                        <>
                            <li><NavLink to='/login'>Login</NavLink></li>
                            <li><NavLink to='/register'>Register</NavLink></li>   
                            <li><NavLink to='questions'>Questions</NavLink></li>
                        </>
                        )
                    }
                </ul>
                {
                    loggedInUser ? (
                        <div>
                            <Link to='user'>
                                <img 
                                    src={loggedInUser.avatar}
                                    alt={loggedInUser.username}
                                    className='photo'
                                />
                            </Link>
                                {loggedInUser.fullName}
                            <LogoutIcon 
                                onClick={() => {
                                logOut();
                                navigate('/');
                            }}
                        />
                        </div>
                    ) : null
                }
            </nav>    
        </StyledHeader>
     );
}
 
export default Header;
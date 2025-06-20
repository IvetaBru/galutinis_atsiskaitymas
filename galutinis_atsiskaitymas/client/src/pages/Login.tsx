import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import InputField from '../components/UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import { User, UserContextType } from '../types';

const StyledSection = styled.section`
    margin: 0;
    height: 100vh;
    background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    >div{
        background-color: #ffffff19;
        backdrop-filter: blur(10px);
        border-radius: 40px;
        padding: 50px 30px;
        width: 380px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: 600;
        >h2{
            margin: 0;
            font-size: 40px;
            padding-bottom: 20px;
        };
    }
    .button{
        margin: 20px;
        padding: 5px 15px;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        font-family: "Nunito", sans-serif;
        color: var(--color-darkest);
        background-color: var(--color-background);
    }
    .button:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    .link{
        text-decoration: none;
        color: var(--color-accent)
    }
    .link:hover{
        color: var(--color-background);
    }
    .message{
        color: var(--color-accentText);
    }
`

const Login = () => {

    const { login } = useContext(UsersContext) as UserContextType;
    const [afterLoginMessage, setAfterLoginMessage] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const navigate = useNavigate();

    const formikInitialValues: Pick<User, 'username' | 'password'> = {
        username: '',
        password: ''
    }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
        username: Yup.string()
            .required('This field is required')
            .trim(),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
            'Password must be 8-25 characters long and include uppercase, lowercase, number, and special character (@$!%*?&)')
            .required('This field is required')
            .trim()
        }),
        onSubmit: async(values) => {
            setAfterLoginMessage('');
            const Context_Response = await login(values, keepLoggedIn);
            if('error' in Context_Response){
                setAfterLoginMessage(Context_Response.error);
            }else{
                setAfterLoginMessage(Context_Response.success);
                setTimeout(() => navigate('/'), 3000);
            }
        }
    });

    return ( 
        <StyledSection>
            <div>
                <h2>Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <InputField 
                    inputName="username"
                    inputId="username"
                    inputType="text"
                    labelText="Username:"
                    inputValue={formik.values.username}
                    errors={formik.errors.username}
                    touched={formik.touched.username}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                    />
                    <InputField 
                    inputName="password"
                    inputId="password"
                    inputType="password"
                    labelText="Password:"
                    inputValue={formik.values.password ?? ''}
                    errors={formik.errors.password}
                    touched={formik.touched.password}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                    />
                    <input type="submit" value="Login" className='button'/>
                </form>
                <div>
                    <input
                        type="checkbox"
                        name="keepSignedIn" id="keepSignedIn"
                        onChange={() => {
                            setKeepLoggedIn(!keepLoggedIn);
                        }}
                    />
                    <label htmlFor="keepSignedIn">Keep me signed in</label>
                </div>
                <p>Don't have an account yet? Go <Link to="/register" className='link'>create</Link> one!</p>
                {
                    afterLoginMessage && <p className='message'>{afterLoginMessage}</p>
                }
            </div>
        </StyledSection>
    );
}
 
export default Login;
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router';

import InputField from '../components/UI/molecules/InputField';
import { User } from '../types';

const StyledSection = styled.section`
    
`

const Login = () => {

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
            'Password must be 8–25 characters long and include uppercase, lowercase, number, and special character (@$!%*?&)')
            .required('This field is required')
            .trim()
        }),
        onSubmit: async(values) => {

        }
    });

    return ( 
        <StyledSection>
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
                inputValue={formik.values.password}
                errors={formik.errors.password}
                touched={formik.touched.password}
                inputOnBlur={formik.handleBlur}
                inputOnChange={formik.handleChange}
                />
                <input type="submit" value="Login" />
            </form>
            <p>Don't have an account yet? Go <Link to="/register">create</Link> one!</p>
        </StyledSection>
    );
}
 
export default Login;
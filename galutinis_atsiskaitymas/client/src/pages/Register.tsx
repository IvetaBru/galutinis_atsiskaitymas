import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router";

import InputField from "../components/UI/molecules/InputField";
import UsersContext from "../contexts/UsersContext";
import { User, UserContextType } from "../types";

const StyledSection = styled.section`
    
`

const Register = () => {

    const { register } = useContext(UsersContext) as UserContextType;
    const [afterRegisterMessage, setAfterRegisterMessage] = useState('');
    const navigate = useNavigate();

    const formikInitialValues: Omit<User, '_id'> = {
        username: '',
        fullName: '',
        email: '',
        password: '',
        passwordRepeat: '',
        avatar: ''
    }

    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
        username: Yup.string()
            .min(5, 'Username is too short')
            .max(20, 'Username is too long')
            .required('This field is required')
            .trim(),
        fullName: Yup.string()
            .required('This field is required')
            .trim(),
        email: Yup.string()
            .email('Enter a valid email')
            .required('This field is required')
            .trim(),
        password: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
            'Password must be 8-25 characters long and include uppercase, lowercase, number, and special character (@$!%*?&)'
            )
            .required('This field is required')
            .trim(),
        passwordRepeat: Yup.string()
            .oneOf([Yup.ref('password')], `Passwords do not match`)
            .required('This field is required'),
        avatar: Yup.string()
            .url('Must be a valid URL')
            .trim()
        }),
        onSubmit: async (values) => {
            setAfterRegisterMessage('');
            const Context_Response = await register(values);
            if('error' in Context_Response){
                setAfterRegisterMessage(Context_Response.error);
            }else{
                setAfterRegisterMessage(Context_Response.success);
                setTimeout(() => navigate('/'), 3000);
            }
        }
    });

    return ( 
        <StyledSection>
            <h2>Register</h2>
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
                    inputName="fullName"
                    inputId="fullName"
                    inputType="text"
                    labelText="Name and surname:"
                    inputValue={formik.values.fullName}
                    errors={formik.errors.fullName}
                    touched={formik.touched.fullName}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                />
                <InputField
                    inputName="email"
                    inputId="email"
                    inputType="email"
                    labelText="Email:"
                    inputValue={formik.values.email}
                    errors={formik.errors.email}
                    touched={formik.touched.email}
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
                <InputField
                    inputName="passwordRepeat"
                    inputId="passwordRepeat"
                    inputType="password"
                    labelText="Repeat password:"
                    inputValue={formik.values.passwordRepeat ?? ''}
                    errors={formik.errors.passwordRepeat}
                    touched={formik.touched.passwordRepeat}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                />
                <InputField
                    inputName="avatar"
                    inputId="avatar"
                    inputType="url"
                    labelText="Profile picture:"
                    inputValue={formik.values.avatar}
                    errors={formik.errors.avatar}
                    touched={formik.touched.avatar}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                />
                <input type="submit" value="Register" />
            </form>
            {
                afterRegisterMessage && <p>{afterRegisterMessage}</p>
            }
            <p>Already have an account? Go <Link to="/login">login</Link>!</p>
        </StyledSection>
     );
}
 
export default Register;
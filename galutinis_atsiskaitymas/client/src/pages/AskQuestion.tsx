import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useContext, useState } from "react";
import { useNavigate } from "react-router";

import InputField from "../components/UI/molecules/InputField";
import MultiSelect from "../components/UI/molecules/MultiSelect";
import QuestionsContext from "../contexts/QuestionsContext";
import { Question, QuestionsContextType } from "../types";

const StyledSection = styled.section`
    padding: 20px 200px;
    >form{
        background-color: #ffffff19;
        backdrop-filter: blur(10px);
        border-radius: 40px;
        padding: 50px 30px;
        min-width: 300px;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        font-weight: 600;
        >label{
            font-size: 20px;
            color: var(--color-darkest);
            padding-top: 10px;
        }
        >textarea{
            margin: 10px;
            padding: 10px;
            border-radius: 10px;
            border: none;
            height: 100px;
            font-weight: 600;
            background-color: var(--color-background);
        }
        >textarea::placeholder{
            color: var(--color-secondary);
        }
    }
    .ask{
        display: block;
        margin: 10px auto 0;
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    .ask:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    .errors{
        margin: 0;
        padding-bottom: 5px;
        font-size: 13px;
        color: var(--color-secondary);
    }
    .message{
        color: var(--color-accentText);
        padding-top: 10px;
    }

    @media (min-width: 0px) and (max-width: 767px) {
        padding: 20px;
    }
    @media (min-width: 768px) and (max-width: 1080px) {
        padding: 20px 100px;
    }
`

const AskQuestion = () => {

    const { addNewQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const [ afterAddMessage, setAfterAddMessage ] = useState('');
    const navigate = useNavigate();
    const allowedTags = ["food","accommodation","excursions","shopping","transport","budget","tips","safety","culture","language","documents","weather","gear","local","solo-travel","family","visa"];

    const formikInitialValues: Pick<Question, 'title' | 'body' | 'tags'> = {
        title: '',
        body: '',
        tags: []
    }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
            title: Yup.string()
                .required('This field is required')
                .trim(),
            body: Yup.string()
                .min(10, 'Question is too short')
                .required('This field is required')
                .trim(),
            tags: Yup.array()
                .of(Yup.string().oneOf(allowedTags, 'Invalid tag selected'))
                .min(1, 'At least one tag must be selected')
                .max(5, 'You can select up to 5 tags only')
        }),
        onSubmit: async (values) => {
            setAfterAddMessage('');
            const Context_Response = await addNewQuestion(values);
            if('error' in Context_Response){
                setAfterAddMessage(Context_Response.error);
            }else{
                setAfterAddMessage(Context_Response.success);
                setTimeout(() => navigate('/questions'), 3000);
            }
        }
    })

    return ( 
        <StyledSection>
            <h2>Ask Question</h2>
            <form onSubmit={formik.handleSubmit}>
                <InputField
                    inputName="title"
                    inputId="title"
                    inputType="text"
                    labelText="Title:"
                    inputValue={formik.values.title}
                    errors={formik.errors.title}
                    touched={formik.touched.title}
                    inputOnBlur={formik.handleBlur}
                    inputOnChange={formik.handleChange}
                />
                <label htmlFor="body">Your Question:</label>
                <textarea 
                    name="body" 
                    id="body"
                    value={formik.values.body}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your question here..." 
                />
                {formik.touched.body && formik.errors.body && <p className="errors">{formik.errors.body}</p>}
                <MultiSelect
                    options={allowedTags}
                    selected={formik.values.tags}
                    onChange={(values) => formik.setFieldValue('tags', values)}
                    maxSelected={5}
                    errors={formik.errors.tags}
                    touched={formik.touched.tags}
                />
            <input type="submit" value="Add Question" className="ask"/>
            {
                afterAddMessage && <p className="message">{afterAddMessage}</p>
            }
            </form>
        </StyledSection>
     );
}
 
export default AskQuestion;
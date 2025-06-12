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
                {formik.touched.body && formik.errors.body && <p>{formik.errors.body}</p>}
                <MultiSelect
                    options={allowedTags}
                    selected={formik.values.tags}
                    onChange={(values) => formik.setFieldValue('tags', values)}
                    maxSelected={5}
                    errors={formik.errors.tags}
                    touched={formik.touched.tags}
                />
            <input type="submit" value="Add Question" />
            </form>
            {
                afterAddMessage && <p>{afterAddMessage}</p>
            }
        </StyledSection>
     );
}
 
export default AskQuestion;
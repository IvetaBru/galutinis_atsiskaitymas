import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";

import { Answer, AnswersContextType } from "../../../types";
import AnswersContext from "../../../contexts/AnswersContext";

const StyledDiv = styled.div`
`

type Props = {
    isOpen: boolean,
    onClose: () => void,
};

const AnswerInput = ({ isOpen, onClose}: Props) => {

    const [ afterAnswerAddMessage, setAnswerAfterAddMessage ] = useState('');
    const { addNewAnswer } = useContext(AnswersContext) as AnswersContextType;


    const formikInitialValues: Pick<Answer, 'body'> = {
            body: ''
        }
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object({
            body: Yup.string()
                .min(10, 'Answer is too short')
                .required('This field is required')
                .trim()
        }),
        onSubmit: async (values, { resetForm }) => {
            setAnswerAfterAddMessage('');
            const result = await addNewAnswer(values);
            if('error' in result){
                setAnswerAfterAddMessage(result.error);
            }else{
                setAnswerAfterAddMessage(result.success);
                resetForm();
                onClose();
            }
        }
    })

    if(!isOpen) return null;

    return ( 
        <StyledDiv>
            <h3>Add Your Answer</h3>
            <form onSubmit={formik.handleSubmit}>
                <textarea 
                    name="body" 
                    value={formik.values.body}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your answer here..." 
                    rows={5}
                />
                {formik.touched.body && formik.errors.body && <p>{formik.errors.body}</p>}
                {
                    afterAnswerAddMessage && <p>{afterAnswerAddMessage}</p>
                }
                <button type="submit">Add</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </StyledDiv>
     );
}
 
export default AnswerInput;
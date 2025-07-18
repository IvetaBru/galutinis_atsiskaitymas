import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { Question, QuestionsContextType } from "../../../types";
import MultiSelect from "./MultiSelect";

type Props = {
    question: Question,
    onClose: () => void;
}

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    >input, textarea{
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        border: none;
        height: 30px;
        font-weight: 600;
        background-color: var(--color-primary);
        font-family: "Nunito", sans-serif;
    }
    >input:hover, textarea:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    >textarea{
        height: 80px;
    }
    >textarea::placeholder{
        color: var(--color-secondary);
    }
    .save{
        display: block;
        margin: 10px auto 0;
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 1px 2px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    .save:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }
    .message{
        color: var(--color-accentText);
    } 
`

const EditingQuestion = ({ question, onClose }: Props) => {

    const { editQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');
    const navigate = useNavigate();
    const allowedTags = ["food","accommodation","excursions","shopping","transport","budget","tips","safety","culture","language","documents","weather","gear","local","solo-travel","family","visa"];

    const [ formData, setFormData ] = useState({
        title: question.title,
        body: question.body,
        tags: question.tags
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
            ...question,
            title: formData.title,
            body: formData.body,
            tags: formData.tags
        };
        const res = await editQuestion(updated);
        if('error' in res) {
            setAfterEditMessage(res.error)
            setTimeout(() => {onClose()}, 2000);
        }else{
            setAfterEditMessage(res.success);
            setTimeout(() => {
                onClose();
                navigate(`/questions/${question._id}`);
            }, 2000);
        }
    };

    return ( 
        <StyledDiv>
            <input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />
            <textarea
                value={formData.body}
                onChange={(e) => handleChange("body", e.target.value)}
            />
            <MultiSelect
                options={allowedTags}
                selected={formData.tags}
                onChange={(editedTags) => setFormData({ ...formData, tags: editedTags })}
            />
            <button onClick={handleSave} className="save">Save</button>
            {
                afterEditMessage && <p className="message">{afterEditMessage}</p>
            }
        </StyledDiv>
     );
}
 
export default EditingQuestion;
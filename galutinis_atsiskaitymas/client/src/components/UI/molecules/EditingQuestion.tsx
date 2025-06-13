import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { Question, QuestionsContextType } from "../../../types";
import MultiSelect from "./MultiSelect";

type Props = {
    question: Question,
    onClose: () => void;
}

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
            setTimeout(() => {onClose()}, 3000);
        }else{
            setAfterEditMessage(res.success);
            setTimeout(() => {
                onClose();
                navigate(`/questions/${question._id}`);
            }, 3000);
        }
    };

    return ( 
        <div>
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
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
            {
                afterEditMessage && <p>{afterEditMessage}</p>
            }
        </div>
     );
}
 
export default EditingQuestion;
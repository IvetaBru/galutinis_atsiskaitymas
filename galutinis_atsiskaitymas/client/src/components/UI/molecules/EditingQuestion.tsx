import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { Question, QuestionsContextType } from "../../../types";

type Props = {
    question: Question,
    onClose: () => void;
}

const EditingQuestion = ({ question, onClose }: Props) => {

    const { editQuestion } = useContext(QuestionsContext) as QuestionsContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState({
        title: question.title,
        body: question.body,
        tags: question.tags.join(", ")
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
            ...question,
            title: formData.title,
            body: formData.body,
            tags: formData.tags.split(",").map((t) => t.trim())
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
            <input
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="e.g. tips, food..."
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
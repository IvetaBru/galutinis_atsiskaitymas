import { useContext, useState } from "react";

import { Answer, AnswersContextType } from "../../../types";
import AnswersContext from "../../../contexts/AnswersContext";

type Props = {
    answer: Answer,
    onClose: () => void;
}

const EditingAnswer = ({ answer, onClose }: Props) => {

    const { editAnswer } = useContext(AnswersContext) as AnswersContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');

    const [ formData, setFormData ] = useState({
        body: answer.body,
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
             ...answer,
            body: formData.body,
        };
        const res = await editAnswer(updated);
        if('error' in res) {
            setAfterEditMessage(res.error)
            setTimeout(() => {onClose()}, 3000);
        }else{
            setAfterEditMessage(res.success);
            onClose();
        }
    };

    return ( 
        <div>
            <div>
                <textarea
                    value={formData.body}
                    onChange={(e) => handleChange("body", e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
                {
                    afterEditMessage && <p>{afterEditMessage}</p>
                }
            </div>
        </div>
     );
}
 
export default EditingAnswer;
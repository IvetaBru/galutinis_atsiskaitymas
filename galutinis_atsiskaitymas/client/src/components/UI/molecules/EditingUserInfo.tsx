import { useState, useContext } from "react";

import { User, UserContextType } from "../../../types";
import UsersContext from "../../../contexts/UsersContext";

type Props = {
    user: Omit<User, 'password'>,
    onClose: () => void;
}

const EditingUserInfo = ({ user, onClose}: Props) => {

    const { editUserInfo } = useContext(UsersContext) as UserContextType;
    const [afterEditMessage, setAfterEditMessage] = useState('');

    const [ formData, setFormData ] = useState({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
    });
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        const updated = {
            ...user,
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            avatar: formData.avatar
        };
        const res = await editUserInfo(updated);
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
                <input
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                />
            </div>
            <div>
                <input
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
            </div>
            <div>
                <input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                />
            </div>
            <div>
                <input
                    value={formData.avatar}
                    onChange={(e) => handleChange("avatar", e.target.value)}
                />
            </div>
            <button onClick={handleSave}>Save</button>
            {
                afterEditMessage && <p>{afterEditMessage}</p>
            }
        </div>
     );
}
 
export default EditingUserInfo;
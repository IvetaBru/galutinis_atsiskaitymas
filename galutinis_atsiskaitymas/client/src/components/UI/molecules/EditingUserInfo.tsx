import { useState, useContext } from "react";
import styled from "styled-components";

import { User, UserContextType } from "../../../types";
import UsersContext from "../../../contexts/UsersContext";

type Props = {
    user: Omit<User, 'password'>,
    onClose: () => void;
}

const StyledDiv = styled.div`
    >div{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 600;
        >input{
            margin: 10px;
            border-radius: 10px;
            border: none;
            height: 30px;
            width: 70%;
            text-align: center;
            font-weight: 600;
            background-color: var(--color-primary);
            font-family: "Nunito", sans-serif;
            color: var(--color-secondary);
        }
        >input:hover{
            background-color: var(--color-accent);
            transition: 0.3s;
        }
    }
    .button{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        margin-top: 10px;
        height: 30px;
        width: 100px;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    .button:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }
    @media (min-width: 1081px){
        >div{
            >input{
                width: 50%;
            }
        }
    }
`

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
        <StyledDiv>
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
            <button onClick={handleSave} className="button">Save</button>
            {
                afterEditMessage && <p>{afterEditMessage}</p>
            }
        </StyledDiv>
     );
}
 
export default EditingUserInfo;
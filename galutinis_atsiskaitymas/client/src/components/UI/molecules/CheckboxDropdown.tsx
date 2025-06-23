import { useState } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
    position: relative;
    display: inline-block;
    .dropdown{
        position: absolute;
        top: 120%; 
        z-index: 1000;
        background-color: var(--color-accentText);
        border: none;
        border-radius: 12px;
        padding: 10px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        box-shadow: 0 6px 12px var(--color-secondary);
    }
    >button{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        width: 150px;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    >button:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
     @media (min-width: 0px) and (max-width: 767px) {
        >button{
            width: 100%;
        }
    }
`

const CheckboxDropdown = ({ selectedTags, onChange }: { selectedTags: string[], onChange: (tags: string[]) => void }) => {

    const allTags = ["food","accommodation","excursions","shopping","transport","budget","tips","safety","culture","language","documents","weather","gear","local","solo-travel","family","visa"];
    const [isOpen, setIsOpen] = useState(false);

    const toggleTag = (tag: string) => {
        if(selectedTags.includes(tag)){
        onChange(selectedTags.filter(t => t !== tag));
        } else {
        onChange([...selectedTags, tag]);
        }
    };

    return ( 
        <StyledDiv>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >Select tags</button>
            {
                isOpen && (
                    <div className="dropdown">
                        {
                            allTags.map(tag => (
                                <label key={tag}>
                                    <input 
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)} 
                                        onChange={() => toggleTag(tag)}
                                    />{tag}
                                </label>
                            ))
                        }
                    </div>
                )
            }
        </StyledDiv>
     );
}
 
export default CheckboxDropdown;
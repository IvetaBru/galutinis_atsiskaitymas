import { useState } from "react";

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
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >Select tags</button>
            {
                isOpen && (
                    <div>
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

        </div>
     );
}
 
export default CheckboxDropdown;
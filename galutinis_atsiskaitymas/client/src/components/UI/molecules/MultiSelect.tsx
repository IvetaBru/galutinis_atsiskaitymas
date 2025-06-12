import { useState, useRef } from "react";

import { MultiSelectProps } from "../../../types";

const MultiSelect = ({ options, selected, onChange, maxSelected=5, errors, touched }: MultiSelectProps) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleCheckboxChange = (option: string) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter(tag => tag !== option));
        } else if (selected.length < maxSelected){
            onChange([...selected, option]);
        }
    };

    return(
        <div ref={ref}>
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
        >
            Select tags…
        </button>
        <span>({selected.length}/{maxSelected})</span>
        {
            isOpen && (
                <div>
                {
                    options.map(option => {
                    const isChecked = selected.includes(option);
                    const isDisabled = !isChecked && selected.length >= maxSelected;

                    return (
                    <label key={option}>
                        <input
                        type="checkbox"
                        value={option}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option)}
                        disabled={isDisabled}
                        />
                        <span>{option}</span>
                    </label>);
                    })
                }
                </div>
            )
        }
        {
            errors && touched && <p>{errors}</p>   
        }
        </div>
    )
}
 
export default MultiSelect;
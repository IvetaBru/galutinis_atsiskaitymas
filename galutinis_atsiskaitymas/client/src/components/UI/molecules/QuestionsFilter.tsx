import { useContext } from "react";
import { useFormik } from "formik";
import styled from "styled-components";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";
import CheckboxDropdown from "./CheckboxDropdown";

const StyledForm = styled.form `
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0px 32px;
    .buttons{
        background-color: var(--color-background);
        border-radius: 12px;
        padding: 2px 10px;
        box-shadow: 0 6px 12px var(--color-secondary);
        >button{
            background-color: var(--color-background);            
            border: none;
            padding: 2px 10px;
            font-family: "Nunito", sans-serif;
            font-weight: 600;
            cursor: pointer;
            &.active{
                color: var(--color-accentText);
            }
        }
        >button:hover{
            color: var(--color-accentText);
        }
    }
    .search{
        border-radius: 10px;
        border: none;
        padding: 0 10px;
        height: 30px;
        font-weight: 600;
        background-color: var(--color-background);
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
    }
    .search:hover{
        background-color: var(--color-accent);
        transition: 0.3s;
    }
    .search::placeholder{
        color: var(--color-darkest);
    }
    .filterClear{
        display: flex;
        gap: 10px;
    }
    .filter, .clear{
        background-color: var(--color-background);
        border: none;
        border-radius: 12px;
        padding: 0 10px;
        height: 30px;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
        font-family: "Nunito", sans-serif;
        cursor: pointer;
    }
    >.filter:hover{
        background-color: var(--color-accentText);
        transition: 0.3s;
    }  
    >.clear:hover{
        background-color: #cc7e7e;
        transition: 0.3s;
    }
    @media (min-width: 0px) and (max-width: 1389px) {
        justify-content: center;
        margin: 20px 0px;
    }   
`

const QuestionsFilter = () => {

    const { changeFilter } = useContext(QuestionsContext) as QuestionsContextType;

    const formik = useFormik({
        initialValues: {
            filter_isAnswered: '',
            filter_title: '',
            filter_tags: [] as string[]
        },
        onSubmit(values){
            const params = new URLSearchParams();
            
            if(values.filter_isAnswered === 'true' || values.filter_isAnswered === 'false'){
                params.append('filter_isAnswered', values.filter_isAnswered);
            }

            if (values.filter_title.trim() !== '') {
                params.append('filter_title', values.filter_title.trim());
            }

            if (values.filter_tags.length > 0) {
                values.filter_tags.forEach(tag => params.append('filter_tags', tag));
            }
            changeFilter(params.toString());
        }
    });

    return ( 
        <StyledForm onSubmit={formik.handleSubmit}>
            <div className="buttons">
                <button
                    type="button"
                    onClick={() => {
                        formik.setFieldValue("filter_isAnswered", "", true);
                        formik.handleSubmit();
                    }}
                    className={formik.values.filter_isAnswered === "" ? "active" : ""}
                >
                    All
                </button>
                <button
                    type="button"
                    onClick={() => {
                        formik.setFieldValue("filter_isAnswered", "true", true);
                        formik.handleSubmit();
                    }}
                    className={formik.values.filter_isAnswered === "true" ? "active" : ""}
                >
                    Answered
                </button>
                <button
                    type="button"
                    onClick={() => {
                        formik.setFieldValue("filter_isAnswered", "false", true);
                        formik.handleSubmit();
                    }}
                    className={formik.values.filter_isAnswered === "false" ? "active" : ""}
                >
                    Unanswered
                </button>
            </div>
            <div>
                <label>
                <input
                    type="text"
                    name="filter_title"
                    onChange={formik.handleChange}
                    value={formik.values.filter_title}
                    placeholder="Search by title..."
                    className="search"
                />
                </label>
            </div>
            <div>
                <CheckboxDropdown 
                    selectedTags={formik.values.filter_tags}
                    onChange={tags => formik.setFieldValue('filter_tags', tags)}
                />
            </div>
            <div className="filterClear">
                <button type="submit" className="filter">Filter</button>
                <button 
                    type="button"
                    onClick={() => {
                        formik.resetForm();
                        formik.handleSubmit();
                    }}
                    className="clear"
                >Clear</button>
            </div>
        </StyledForm>
    );
}
 
export default QuestionsFilter;
import { useContext } from "react";
import { useFormik } from "formik";
import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";
import CheckboxDropdown from "./CheckboxDropdown";

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
        <form onSubmit={formik.handleSubmit}>
            <div>
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
                Title:
                <input
                    type="text"
                    name="filter_title"
                    onChange={formik.handleChange}
                    value={formik.values.filter_title}
                    placeholder="Search..."
                />
                </label>
            </div>
            <div>
                <CheckboxDropdown 
                    selectedTags={formik.values.filter_tags}
                    onChange={tags => formik.setFieldValue('filter_tags', tags)}
                />
            </div>
        <button type="submit">Filter</button>
        <button 
            type="button"
            onClick={() => {
                formik.resetForm();
                formik.handleSubmit();
            }}
        >Clear</button>
        </form>
    );
}
 
export default QuestionsFilter;
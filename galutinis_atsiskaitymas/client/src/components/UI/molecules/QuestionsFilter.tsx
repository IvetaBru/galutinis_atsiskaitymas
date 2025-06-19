import { useContext } from "react";
import { useFormik } from "formik";
import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const QuestionsFilter = () => {

    const { changeFilter } = useContext(QuestionsContext) as QuestionsContextType;

    const formik = useFormik({
        initialValues: {
            filter_isAnswered: '',
            filter_title: '',
            filter_tags: ''
        },
        onSubmit(values){
            const params = new URLSearchParams();
            
            if(values.filter_isAnswered === 'true' || values.filter_isAnswered === 'false'){
                params.append('filter_isAnswered', values.filter_isAnswered);
            }

            if (values.filter_title.trim() !== '') {
                params.append('filter_title', values.filter_title.trim());
            }

            if (values.filter_tags.trim() !== '') {
                const tagsArray = values.filter_tags.split(',').map(t => t.trim()).filter(Boolean);
                tagsArray.forEach(tag => params.append('filter_tags', tag));
            }

            changeFilter(params.toString());
        }
    });

    return ( 
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label>
                Is Answered:
                <select
                    name="filter_isAnswered"
                    onChange={formik.handleChange}
                    value={formik.values.filter_isAnswered}
                >
                    <option value="">All</option>
                    <option value="true">Answered</option>
                    <option value="false">Unanswered</option>
                </select>
                </label>
            </div>
            <div>
                <label>
                Title:
                <input
                    type="text"
                    name="filter_title"
                    onChange={formik.handleChange}
                    value={formik.values.filter_title}
                    placeholder="Search title..."
                />
                </label>
            </div>
            <div>
                <label>
                Tags:
                <input
                    type="text"
                    name="filter_tags"
                    onChange={formik.handleChange}
                    value={formik.values.filter_tags}
                    placeholder="tag1, tag2, tag3"
                />
                </label>
            </div>
        <button type="submit">Filter</button>
        </form>
     );
}
 
export default QuestionsFilter;
import { useContext } from "react";
import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const QuestionsSort = () => {

    const { changeSort } = useContext(QuestionsContext) as QuestionsContextType;

    return ( 
        <div>
            <h4>Sort by:</h4>
            <select onChange={(e) => changeSort(e.target.value)} defaultValue="sort_createdAt=-1">
                <option value="sort_createdAt=-1">Newest</option>
                <option value="sort_createdAt=1">Oldest</option>
                <option value="sort_answersCount=-1">Most answered</option>
                <option value="sort_answersCount=1">Least answered</option>
            </select>
        </div>
     );
}
 
export default QuestionsSort;
import { useContext } from "react";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const PageSize = () => {

    const { changePageSize } = useContext(QuestionsContext) as QuestionsContextType;

    return ( 
        <div>
            <h3>Questions shown</h3>
            <select 
                defaultValue={'2'} 
                onChange={(e) => changePageSize(Number(e.target.value))}
            >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="10">10</option>
            </select>
        </div>
     );
}
 
export default PageSize;
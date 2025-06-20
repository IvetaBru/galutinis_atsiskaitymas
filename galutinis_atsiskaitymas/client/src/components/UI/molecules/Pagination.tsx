import { useContext } from "react";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const Pagination = () => {

    const {  filteredDataAmount, pageSize, changePage, currentPage } = useContext(QuestionsContext) as QuestionsContextType;
    const lastPage = filteredDataAmount === 0 ? 1 : Math.ceil(filteredDataAmount/pageSize);
    
    return (
      <div>
        <div>
          <button
            disabled={currentPage === 1 ? true : false}
            onClick={() => changePage(currentPage-1)}
            >⬅️</button>
          <span> </span>
          {
            currentPage !== 1 &&
            <button
            onClick={() => changePage(1)}
            >1</button>
          }
          {
            currentPage - 3 > 1 && <span>...</span>
          }
          {
            currentPage - 2 !== 1 && currentPage - 2 > 0 &&
            <button
            onClick={() => changePage(currentPage-2)}
            >{currentPage-2}</button>
          }
          {
            currentPage - 1 !== 1 && currentPage - 1 > 0 &&
            <button
            onClick={() => changePage(currentPage-1)}
            >{currentPage-1}</button>
          }
          <button
            disabled
            >{currentPage}</button>
          {
            currentPage + 1 !== lastPage && currentPage + 1 < lastPage &&
            <button
            onClick={() => changePage(currentPage+1)}
            >{currentPage+1}</button>
          }
          {
            currentPage + 2 !== lastPage && currentPage + 2 < lastPage &&
            <button
            onClick={() => changePage(currentPage+2)}
            >{currentPage+2}</button>
          }
          {
            currentPage + 3 < lastPage && <span>...</span>
          }
          {
            currentPage !== lastPage &&
            <button
            onClick={() => changePage(lastPage)}
            >{lastPage}</button>
          }
          <button
            disabled={currentPage === lastPage ? true : false}
            onClick={() => changePage(currentPage+1)}
          >➡️</button>
        </div>
        <p>Shown {filteredDataAmount ? (currentPage-1)*pageSize+1 : 0} - {currentPage*pageSize > filteredDataAmount ? filteredDataAmount : currentPage*pageSize} from {filteredDataAmount} questions</p>
    </div>
    
  );
};
 
export default Pagination;
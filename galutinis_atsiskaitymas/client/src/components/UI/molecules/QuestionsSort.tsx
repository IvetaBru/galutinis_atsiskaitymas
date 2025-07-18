import { useContext } from "react";
import styled from "styled-components";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const StyleDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 32px;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 15px;
    >p{
        margin: 0px;
    }
    >select{
        background-color: var(--color-background);
        border-radius: 12px;
        border: none;
        padding: 2px;
        font-family: "Nunito", sans-serif;
        font-weight: 600;
        box-shadow: 0 6px 12px var(--color-secondary);
    }
`

const QuestionsSort = () => {

    const { changeSort } = useContext(QuestionsContext) as QuestionsContextType;

    return ( 
        <StyleDiv>
            <p>Sort by:</p>
            <select onChange={(e) => changeSort(e.target.value)} defaultValue="sort_createdAt=-1">
                <option value="sort_createdAt=-1">Newest</option>
                <option value="sort_createdAt=1">Oldest</option>
                <option value="sort_answersCount=-1">Most answered</option>
                <option value="sort_answersCount=1">Least answered</option>
            </select>
        </StyleDiv>
     );
}
 
export default QuestionsSort;
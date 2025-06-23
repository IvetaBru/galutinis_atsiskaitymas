import { useContext } from "react";
import styled from "styled-components";

import QuestionsContext from "../../../contexts/QuestionsContext";
import { QuestionsContextType } from "../../../types";

const StyledDiv = styled.div`
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
    @media (min-width: 0px) and (max-width: 1389px) {
            justify-content: center;
            padding: 0px;
    }
`

const PageSize = () => {

    const { changePageSize } = useContext(QuestionsContext) as QuestionsContextType;

    return ( 
        <StyledDiv>
            <p>Questions shown in page</p>
            <select 
                defaultValue={'2'} 
                onChange={(e) => changePageSize(Number(e.target.value))}
            >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="10">10</option>
            </select>
        </StyledDiv>
     );
}
 
export default PageSize;
import { useParams } from "react-router";

import { AnswersProvider } from "../contexts/AnswersContext";
import SpecificQuestionContent from "../components/UI/organisms/SpecificQuestionContent";

const SpecificQuestion = () => {

    const { _id } = useParams();

    if (!_id) return <p>Invalid question ID</p>;

    return ( 
        <AnswersProvider questionId={_id}>
            <SpecificQuestionContent />
        </AnswersProvider>
     );
}
 
export default SpecificQuestion;
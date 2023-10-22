import { useParams } from "react-router-dom";
import { ResourceCard } from "../components";
import { formatDateToTime } from "../utils";

const base_url = "http://localhost:5000/api/v1/users/resources/";

const LevelResources = () => {
    const {level} = useParams()
    console.log(level)
    var tempData = JSON.parse(localStorage.getItem("filesDetails"));
    const levelDetails = tempData[level];
    const fileList = levelDetails.map(obj => Object.keys(obj)[0])

    return (
        <div>
            {fileList.map((file, index) => ( 
                <ResourceCard key={index} fileUrl={base_url + file} description={levelDetails[index][file]['description']}
                uploaderUsername = {levelDetails[index][file]['uploaderUsername']}
                title = {levelDetails[index][file]['title']}
                date = {formatDateToTime(new Date(levelDetails[index][file]['date']))}
                semester = {levelDetails[index][file]['semester']}
                course = {levelDetails[index][file]['course']}
                />
            ))}
        </div>
    )
}

export default LevelResources;
import { ResourceCard } from ".";
import { FaMagnifyingGlass } from "react-icons/fa6";

const base_url = 'http://localhost:5000/api/v1/users/resources/'

const ResourceSearch = ({query}) => {
    // get the files details from the local storage
    const tempData = JSON.parse(localStorage.getItem("filesDetails"));
    
    const newData = []

    if (query && tempData && tempData.length !== 0) {
        const myfileList = tempData.map(obj => Object.keys(obj)[0]);
        myfileList.forEach((file, index) => {
            if (tempData[index][file]['title'].toLowerCase().includes(query.toLowerCase())) {
                newData.push({[file]: tempData[index][file]})
            };
        });
    }
    const fileList = newData.map(obj => Object.keys(obj)[0])
    return (
        <div>
            <div  className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex z-0 flex-wrap gap-4 justify-around">
                {fileList.map((file, index) => ( 
                    <ResourceCard key={index} fileUrl={base_url + file} description={newData[index][file]['description']}
                    uploaderUsername = {newData[index][file]['uploaderUsername']}
                    title = {newData[index][file]['title']}
                    date = {newData[index][file]['date']}
                    semester = {newData[index][file]['semester']}
                    course = {newData[index][file]['course']}
                    />
                ))}
            </div>
            </div>
    )


}

export default ResourceSearch;
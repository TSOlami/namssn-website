import { ResourceCard } from ".";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { formatDateToTime } from "../utils";

const base_url = 'https://namssn-futminna.onrender.com/api/v1/users/resources/'

const isSubDictPresent = (mainDict, subDict) => {
    for (const [key, value] of Object.entries(subDict)) {
        if (mainDict[key] !== value) {
          return false;
        }
      }
      return true;
}


const ResourceSearch = ({query}) => {
    // get the files details from the local storage
    const tempData = JSON.parse(localStorage.getItem("filesDetails"));
    var tempData2 = [...Object.values(tempData)]
    tempData2 = tempData2.flat()
    // console.log(tempData2)
    
    const newData = {}

    if (query && tempData2 && tempData2.length !== 0) {
        const myfileList = tempData2.map(obj => Object.keys(obj)[0])
        myfileList.forEach((file, index) => {
            if (tempData2[index][file]['title'].toLowerCase().includes(query.toLowerCase())) {
                Object.keys(tempData).forEach((key) => {
                    for (let j=0; j<tempData[key].length; j++) {
                        if (isSubDictPresent(tempData[key][j], {[file]: tempData2[index][file]})) {
                            console.log(file)
                            if (Object.keys(newData).includes(key)) {
                                newData[[key]].push({[file]: tempData2[index][file]})
                            } else {
                                newData[[key]] = [{[file]: tempData2[index][file]}]
                            }
                            console.log(newData)
                        }
                    }
                });
            }
        })
    }
    var tempData3 = [...Object.values(newData)]
    tempData3 = tempData3.flat()
    const fileList = tempData3.map(obj => Object.keys(obj)[0])
    return (
        <div className="w-full">
            <div className="pt-4 pl-6 text-gray-400">
                <span className="text-lg font-serif">Resources</span>
            </div>
             <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
                {fileList.map((file, index) => ( 
                    <ResourceCard key={index} fileUrl={base_url + file} description={tempData3[index][file]['description']}
                    uploaderUsername = {tempData3[index][file]['uploaderUsername']}
                    title = {tempData3[index][file]['title']}
                    date = {formatDateToTime(new Date(tempData3[index][file]['date']))}
                    semester = {tempData3[index][file]['semester']}
                    course = {tempData3[index][file]['course']}
                    />
                ))}
            </div>


            {/* <div className="pt-4 pl-6 text-gray-400"> */}
                        {/* <span className="text-lg font-serif">Resources</span>
            </div>
            <div  className="px-[1em] w-[100%] md:px-[2em] lg:px-[0.3em] pt-4 flex z-0 flex-wrap gap-4 justify-around">
                {fileList.map((file, index) => ( 
                    <ResourceCard key={index} fileUrl={base_url + file} description={newData[index][file]['description']}
                    uploaderUsername = {newData[index][file]['uploaderUsername']}
                    title = {newData[index][file]['title']}
                    date = {newData[index][file]['date']}
                    semester = {newData[index][file]['semester']}
                    course = {newData[index][file]['course']}
                    />
                ))}
            </div> */}
        </div>
    )


}

export default ResourceSearch;
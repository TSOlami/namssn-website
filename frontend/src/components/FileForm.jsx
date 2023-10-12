import { useState } from "react";
import axios from 'axios';

const FileForm = (props) => {
    const textStyle = "font-bold font-crimson text-lg"

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/users/resources', formData);
            console.log(response);
        } catch(err) {
            console.log(err);
        }
    }

    if(props.show) {
        return (
            <div className="z-999 w-[70%] flex flex-col bg-white gap-4 border rounded-lg px-[2.5%] py-[2.5%]">
                <div >
                    <span className={textStyle}> Semester</span>
                    <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                        <option value="option1" className="text-black">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div> 
                <div >
                    <span className={textStyle}> Course </span>
                    <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                        <option value="option1" className="text-black">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div> 
                <div className="flex flex-col">
                    <span className={textStyle}> File </span>
                    <input
                        type="file" onChange={handleFileChange}
                    />
                </div> 
                <div className="flex justify-between px-[%]">
                <button className="py-2 px-4 bg-red-600 border rounded-lg text-white" onClick={props.onClose}>Cancel</button>
                <button className="py-2 px-4 bg-green-600 border rounded-lg text-white" onClick={handleSubmit}>Upload</button>
                </div>
                
            </div>
        )
    }
}

export default FileForm;
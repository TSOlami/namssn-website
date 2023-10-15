// import { useState } from "react";
// import axios from 'axios';
// import { toast, ToastContainer } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from 'yup';


// const FileForm = (props) => {
//     const textStyle = "font-bold font-crimson text-lg"

//     const validationSchema = Yup.object().shape({
//         file: Yup.mixed().test('fileSize', 'File is too large', (value) => value && value.size <= 5000000),
//     });

//     const [selectedFile, setSelectedFile] = useState(null);

//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     }
//     const navigate = useNavigate();
//     const handleSubmit = async () => {
//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         try {
//             const res = await axios.post('http://127.0.0.1:5000/api/v1/users/resources', formData);
//             window.location.reload(); 
//             toast.success("File Uploaded Successfully");
//         } catch (err) {
//             console.log(err);
//             toast.error("File not uploaded, an error occurred");
//         }
//     } 

//     if(props.show) {
//         return (
//             <div className="w-[70%] flex flex-col bg-white gap-4 border rounded-[5%] px-[2.5%] py-[2.5%]">
//                 <div >
//                     <span className={textStyle}> Semester</span>
                    // <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                    //     <option value="option1" className="text-black font-crimson text-lg">Year 1 First Semester</option>
                    //     <option value="option2" className="text-black font-crimson text-lg">Year 1 Second Semester</option>
                    //     <option value="option3" className="text-black font-crimson text-lg">Year 2 First Semester</option>
                    //     <option value="option4" className="text-black font-crimson text-lg">Year 2 Second Semester</option>
                    //     <option value="option5" className="text-black font-crimson text-lg">Year 3 First Semester</option>
                    //     <option value="option6" className="text-black font-crimson text-lg">Year 3 Second Semester</option>
                    //     <option value="option7" className="text-black font-crimson text-lg">Year 4 First Semester</option>
                    //     <option value="option8" className="text-black font-crimson text-lg">Year 4 Second Semester</option>
                    //     <option value="option9" className="text-black font-crimson text-lg">Year 5 First Semester</option>
                    //     <option value="option10" className="text-black font-crimson text-lg">Year 5 Second Semester</option>
                    // </select>
//                 </div> 
//                 <div >
//                     <span className={textStyle}> Course </span>
                    // <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                    //     <option value="option1" className="text-black font-crimson text-lg">Course A</option>
                    //     <option value="option2" className="text-black font-crimson text-lg">Course B</option>
                    //     <option value="option3" className="text-black font-crimson text-lg">Course C</option>
                    //     <option value="option4" className="text-black font-crimson text-lg">Course D</option>
                    // </select>
//                 </div> 
//                 <div className="flex flex-col">
//                     <span className={textStyle}> File </span>
//                     <input
//                         type="file" name="file" onChange={handleFileChange}
//                     />
//                 </div> 
//                 <div className="flex justify-between px-[%]">
//                 <button className="py-2 px-4 hover:bg-red-900 bg-red-600 border rounded-lg text-white" onClick={props.onClose}>Cancel</button>
//                 <button className="py-2 px-4 bg-green-600 hover:bg-green-900 border rounded-lg text-white" onClick={handleSubmit}>Upload</button>
//                 </div>
//                 <ToastContainer/>
//             </div>
//         )
//     }
// }

// export default FileForm;

import { useState } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';

const FileForm = (props) => {
    const textStyle = "font-bold font-crimson text-lg"
    const errorStyle = "text-red-500 text-sm";

    const validationSchema = Yup.object().shape({
        file: Yup.mixed().test('fileSize', 'File is too large', (value) => value && value.size <= 5000000),
    });

    const formik = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('file', values.file);
            try {
                const res = await axios.post('http://127.0.0.1:5000/api/v1/users/resources', formData);
                window.location.reload(); 
                toast.success("File Uploaded Successfully");
            } catch (err) {
                console.log(err);
                toast.error("File not uploaded, an error occurred");
            }
        },
    });

    if(props.show) {
        return (
            <div className="w-[70%] flex flex-col bg-white gap-4 border rounded-[5%] px-[2.5%] py-[2.5%]">
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <span className={textStyle}> Semester</span>
                        <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                            <option value="option1" className="text-black font-crimson text-lg">Year 1 First Semester</option>
                            <option value="option2" className="text-black font-crimson text-lg">Year 1 Second Semester</option>
                            <option value="option3" className="text-black font-crimson text-lg">Year 2 First Semester</option>
                            <option value="option4" className="text-black font-crimson text-lg">Year 2 Second Semester</option>
                            <option value="option5" className="text-black font-crimson text-lg">Year 3 First Semester</option>
                            <option value="option6" className="text-black font-crimson text-lg">Year 3 Second Semester</option>
                            <option value="option7" className="text-black font-crimson text-lg">Year 4 First Semester</option>
                            <option value="option8" className="text-black font-crimson text-lg">Year 4 Second Semester</option>
                            <option value="option9" className="text-black font-crimson text-lg">Year 5 First Semester</option>
                            <option value="option10" className="text-black font-crimson text-lg">Year 5 Second Semester</option>
                        </select>
                    </div> 
                    <div>
                        <span className={textStyle}> Course </span>
                        <select id="dropdown" name="dropdown" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                            <option value="option1" className="text-black font-crimson text-lg">Course A</option>
                            <option value="option2" className="text-black font-crimson text-lg">Course B</option>
                            <option value="option3" className="text-black font-crimson text-lg">Course C</option>
                            <option value="option4" className="text-black font-crimson text-lg">Course D</option>
                        </select>
                    </div> 
                    <div className="flex flex-col">
                        <span className={textStyle}> File </span>
                        <input
                            type="file" name="file" onChange={(event) => formik.setFieldValue("file", event.currentTarget.files[0])} onBlur={formik.handleBlur}
                        />
                        {formik.touched.file && formik.errors.file ? (
                            <div className={errorStyle}>{formik.errors.file}</div>
                        ) : null}
                    </div> 
                    <div className="flex justify-between px-[%]">
                        <button className="py-2 px-4 hover:bg-red-900 bg-red-600 border rounded-lg text-white" onClick={props.onClose}>Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-green-600 hover:bg-green-900 border rounded-lg text-white">Upload</button>
                    </div>
                </form>
                <ToastContainer/>
            </div>
        )
    }
}

export default FileForm;

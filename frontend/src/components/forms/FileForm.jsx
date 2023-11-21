import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import store from "../../redux/store/store";
import Loader from "../Loader";
import { BiUpload } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";

const state = store.getState();
const userInfo = state?.auth?.userInfo;

const FileForm = (props) => {
    const textStyle = "font-bold font-roboto text-lg"
    const errorStyle = "text-red-500 text-sm";
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [fileName, setFileName] = useState("Select File");
    
    useEffect(() => {
    }, [inputValue]);
    const [selectedOption1, setSelectedOption1] = useState("100 Level");
    const [selectedOption2, setSelectedOption2] = useState("option1");
    const handleSelectChange1 = (e) => {
        setSelectedOption1(e.target.value);
        };
    useEffect(() => {
    }, [selectedOption1]);

    const validationSchema = Yup.object().shape({
        file: Yup.mixed()
        .test('fileSize', 'File is too large', (value) => value && value.size <= 500000000)
        .test('fileType', 'Videos are not allowed', (value) => value && value.type && value.type.indexOf('video') === -1)
    });

    const formik = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (userInfo?.isVerified === true) {
                setIsLoading(true);
                const date = new Date();
                const formData = new FormData();
                formData.append('file', values.file);
                formData.append('userId', props.userId);
                formData.append('uploaderName', props.name);
                formData.append('description', inputValue);
                formData.append('date', date);
                formData.append('semester', selectedOption1);
                formData.append('course', selectedOption2)
                try {

                    await toast.promise(axios.post('http://localhost:5000/api/v1/users/resources', formData), {
                        pending: 'Uploading file...',
                        success: 'File uploaded successfully',
                    });
                    setIsLoading(false);
                    window.location.reload()
                } catch (err) {
                    toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
                    setIsLoading(false);
                }
            } else {
                toast.error("Only verified students are eligible to upload resources")
            }
        },
    });

    if(props.show) {
        return (
            <div className="w-[80%] flex flex-col bg-white gap-4 border rounded-[5%] px-[2.5%] py-[2.5%]">
                <form onSubmit={formik.handleSubmit}>
                    <button onClick={props.onClose} className="ml-[88%] md:ml-[90%] text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
                        <FaXmark/>
                    </button>
                    <div>
                        <span className={textStyle}> Level</span>
                        <select value={selectedOption1} onChange={handleSelectChange1} name="dropdown1" className="font-roboto text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                            <option value="100 Level" className="text-black font-roboto text-lg">Year 1 </option>
                            <option value="200 Level" className="text-black font-roboto text-lg">Year 2 </option>
                            <option value="300 Level" className="text-black font-roboto text-lg">Year 3 </option>
                            <option value="400 Level" className="text-black font-roboto text-lg">Year 4 </option>
                            <option value="500 Level" className="text-black font-roboto text-lg">Year 5 </option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-2 h-[7em]">
                        <span className={textStyle}> File Description </span>
                        <div className="font-roboto h-[100%] w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200">
                            <textarea
                            className="w-full resize-y h-full whitespace-wrap outline-none"
                            placeholder="Input file description (optional)"
                            type="text" value={inputValue} maxLength={100} onChange={(e) => setInputValue(e.target.value)} />
                         </div>
                    </div> 
                    <div className="mt-2 flex flex-col">
                        <span className={textStyle}> File </span>
                        <label className="flex justify-between  border border-black items-center rounded-md w-[80%] h-[2.5em]">
                            <div className="ml-[2em]">
                                <span className="font-roboto text-gray-300">
                                    {fileName.length > 20 ? `${fileName.substring(0,15)}...` : fileName}
                                </span>
                            </div>
                            <BiUpload className="mr-[2em]" color="#0f0f0f"/>
                            <input
                            style={{ display: 'none' }} type="file"
                            name="file"
                            onChange={(event) => {
                                formik.setFieldValue("file", event.currentTarget.files[0])
                                if (event.currentTarget.files[0]) {
                                    setFileName(event.currentTarget.files[0].name);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            />
                        </label>
                        {formik.touched.file && formik.errors.file ? (
                            <div className={errorStyle}>{formik.errors.file}</div>
                        ) : null}
                    </div> 
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="font-roboto py-2 px-4 bg-blue-600 hover:bg-white  hover:border-blue-600 border-2 rounded-lg text-white hover:text-blue-600">Upload</button>
                    </div>
                </form>
                <ToastContainer/>
                {isLoading && <Loader />}
            </div>
        )
    }
}

export default FileForm;

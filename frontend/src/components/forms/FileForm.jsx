import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { BiUpload } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import Select from "../Select";

const post_url = import.meta.env.VITE_RESOURCES_URL

const FileForm = (props) => {
    // Get the user info from the redux store
    const userInfo = useSelector((state) => state.auth.userInfo);

    const textStyle = "font-bold font-roboto text-lg"
    const errorStyle = "text-red-500 text-sm";
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [fileName, setFileName] = useState("Select File");
    useEffect(() => {
    }, [inputValue]);
    const [selectedOption1, setSelectedOption1] = useState("100 Level");
    const [selectedOption2] = useState("option1");
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

                    await toast.promise(axios.post(post_url, formData), {
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
            <div className="shadow-xl w-[80%] flex flex-col bg-white gap-4 border rounded-[5%] px-[2.5%] py-[2.5%]">
                <form onSubmit={formik.handleSubmit}>
                    <button onClick={props.onClose} className="ml-[88%] md:ml-[90%] text-xl text-gray-700 hover:bg-black hover:text-white p-2 rounded-md">
                        <FaXmark/>
                    </button>
                    <div>
                        <Select
                            label="Level"
                            value={selectedOption1}
                            onChange={handleSelectChange1}
                            name="dropdown1"
                            options={[
                                { value: "100 Level", label: "Year 1" },
                                { value: "200 Level", label: "Year 2" },
                                { value: "300 Level", label: "Year 3" },
                                { value: "400 Level", label: "Year 4" },
                                { value: "500 Level", label: "Year 5" },
                            ]}
                            className="w-[80%]"
                        />
                    </div>
                    <div className="flex flex-col mt-2 h-[7em]">
                        <span className={textStyle}> File Description </span>
                        <div className="font-roboto h-[100%] w-[80%] mt-1 p-2 border border-gray-400 rounded-md  focus:ring focus:ring-blue-200">
                            <textarea
                            className="w-full resize-y h-full whitespace-wrap outline-none"
                            placeholder="Input file description (optional)"
                            type="text" value={inputValue} maxLength={100} onChange={(e) => setInputValue(e.target.value)} />
                         </div>
                    </div> 
                    <div className="mt-2 flex flex-col">
                        <span className={textStyle}> File </span>
                        <label className="flex justify-between  border border-gray-400 items-center rounded-md w-[80%] h-[2.5em]">
                            <div className="ml-[2em]">
                                {fileName !== "Select File" ? (<span className="font-roboto text-gray-800">
                                    {fileName.length > 20 ? `${fileName.substring(0,15)}...` : fileName}
                                </span>) : (<span className="font-roboto text-gray-400">
                                    {fileName}
                                </span>)}
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
                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className={`font-roboto py-2 px-4 bg-blue-600 hover:bg-white hover:border-blue-600 border-2 rounded-lg text-white hover:text-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </button>
                    </div>
                </form>
                <ToastContainer/>
            </div>
        )
    }
}

export default FileForm;

import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import InputField from "../InputField";
import FormErrors from "./FormErrors";
import { convertToBase64 } from "../../utils";

const EventForm = () => {
	// Set file state
	const [file, setFile] = useState();


	// const SUPPORTED_FORMATS = [
	// 	"image/jpg",
	// 	"image/png",
	// 	"image/jpeg",
	// 	"image/gif",
	// ];

	const initialValues = {
		title: "",
		// description: "",
		// date: "",
		// time: "",
		// location: "",
		// image: null,
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("Event title cannot be empty"),
		// description: Yup.string().required("Event description is required"),
		// date: Yup.date().required("Event date is required"),
		// time: Yup.string().required("Time is required"),
		// location: Yup.string().required("Event location is required"),
		// image: Yup.mixed()
		// 	.nullable()
		// 	.required("An event flyer is required")
		// 	.test(
		// 		"size",
		// 		"File size is too big",
		// 		(value) => value && value.size <= 1024 * 1024 // 5MB
		// 	)
		// 	.test(
		// 		"type",
		// 		"Invalid file format selection",
		// 		(value) =>
		// 			// console.log(value);
		// 			!value || (value && SUPPORTED_FORMATS.includes(value?.type))
		// 	),
	});

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				values = Object.assign(values, { image: file });
				console.log(values);
			} catch (error) {
				console.log(error);
			}
		},
	});

	// File upload handler
	const onUpload = async e => {
		const base64 = await convertToBase64(e.target.files[0]);
		setFile(base64);
  };

	return (
		<form className="flex flex-col justify-center p-5 md:px-10 h-full" onSubmit={formik.handleSubmit}>
			<label htmlFor="title">Event Title</label>
			<InputField
				type="text"
				name="title"
				id="title"
				onChange={formik.handleChange("name")}
				value={formik.values.title}
				placeholder="Enter event title"
			/>
			{formik.touched.title && formik.errors.title ? (
				<FormErrors error={formik.errors.title} />
			) : null}

			{/* <label htmlFor="description" className="mt-5">Event Description</label>
			<InputField
				type="text"
				name="description"
				id="description"
				onChange={formik.handleChange("description")}
				value={formik.values.description}
				placeholder="Enter event description"
			/>
			{formik.touched.description && formik.errors.description ? (
				<FormErrors error={formik.errors.description} />
			) : null} */}

			{/* <label htmlFor="location" className="mt-5">Event Location</label>
			<InputField
				name="location"
				id="location"
				onChange={formik.handleChange("location")}
				value={formik.values.location}
				placeholder="Enter event location"
			/>
			{formik.touched.location && formik.errors.location ? (
				<FormErrors error={formik.errors.location} />
			) : null} */}

			{/* <label htmlFor="date" className="mt-5">Event Date</label>
			<input
				type="date"
				name="date"
				id="date"
				onChange={formik.handleChange("date")}
				value={formik.values.date}
				className="py-2"
			/>
			{formik.touched.date && formik.errors.date ? (
				<FormErrors error={formik.errors.date} />
			) : null} */}

			<label htmlFor="image" className="mt-5 cursor-pointer border-2 w-fit p-2 text-white bg-black rounded-lg">Add Event Flyer</label>
      <input onChange={onUpload} type="file" name="image" id="image" className="p-5 bg-black text-white rounded-lg" />

			<div className="mt-5 flex flex-row gap-8 ml-auto">
				<button type="button" className="p-3 border-2 rounded-lg border-red-600 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">Delete Event</button>
				<button type="submit" className="bg-primary rounded-lg p-3 text-white hover:opacity-75">Save Event</button>
			</div>
		</form>
	);
};

export default EventForm;

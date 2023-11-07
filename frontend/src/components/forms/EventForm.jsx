import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { InputField, FormErrors, Loader } from "../../components";
import { convertToBase64 } from "../../utils";
import { toast } from "react-toastify";
import { useCreateEventMutation, setEvents } from "../../redux";

const EventForm = () => {
	// Use the useCreateEventMutation hook to create an event
	const [createEvent, { isLoading }] = useCreateEventMutation();

	// Use the useDispatch hook to dispatch actions
	const dispatch = useDispatch();

	// Set file state
	const [file, setFile] = useState();


	const initialValues = {
		title: "",
		date: "",
		location: "",
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("Event title cannot be empty"),
		date: Yup.date().required("Event date is required"),
		location: Yup.string().required("Event location is required"),
	});

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			// Check if image is empty
			if (file === undefined) {
				toast.error("Please upload a valid event flyer");
				return;
			}
			// Add the file to the form data and send to the server
			try {
				let updatedValues = Object.assign(values, { image: file });
				const res = await createEvent(updatedValues).unwrap();
				dispatch(setEvents({ ...res }));
				toast.success("Event created successfully");
				console.log(updatedValues);

				// Reset form and clear uploaded image
				formik.resetForm();
				setFile(null);

				// Reset the input element for file upload
				const inputElement = document.getElementById("image");
				if (inputElement) {
					inputElement.value = null;
				}
			} catch (error) {
				toast.error("Something went wrong");
				console.log(error);
			}
		},
	});

	// File upload handler
	const onUpload = async (e) => {
		// Check file size, must be 2MB or less
		const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB
		if (file.size > maxSize) {
			toast.error("File size too large");

			return;
		}
		// File size is okay, convert to base64
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
				onBlur={formik.handleBlur("title")}
				onChange={formik.handleChange("title")}
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

			<label htmlFor="location" className="mt-5">Event Location</label>
			<InputField
				name="location"
				id="location"
				onChange={formik.handleChange("location")}
				value={formik.values.location}
				placeholder="Enter event location"
			/>
			{formik.touched.location && formik.errors.location ? (
				<FormErrors error={formik.errors.location} />
			) : null}

			<label htmlFor="date" className="mt-5">Event Date</label>
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
			) : null}

			<label htmlFor="image" className="mt-5 cursor-pointer border-2 w-fit p-2 text-white bg-black rounded-lg">Add Event Flyer</label>
      <input required onChange={onUpload} type="file" name="image" id="image" className="p-5 bg-black text-white rounded-lg" />

			<div className="mt-5 flex flex-row gap-8 ml-auto">
				<button type="button" className="p-3 border-2 rounded-lg border-red-600 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">Delete Event</button>
				<button type="submit" className="bg-primary rounded-lg p-3 text-white hover:opacity-75">Save Event</button>
			</div>
			{isLoading && <Loader />}
		</form>
	);
};

export default EventForm;

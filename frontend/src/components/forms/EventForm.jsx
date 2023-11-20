import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { InputField, FormErrors } from "../../components";
import { convertToBase64 } from "../../utils";
import { toast } from "react-toastify";
import { useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation, setEvents } from "../../redux";

const EventForm = ({ selectedOption }) => {
	// Use the useCreateEventMutation hook to create an event
	const [createEvent] = useCreateEventMutation();

	// Use the useUpdateEventMutation hook to update an event
	const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

	// Use the useDeleteEventMutation hook to delete an event
	const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

	// State to manage image preview
  const [imagePreview, setImagePreview] = useState(selectedOption?.image || null);

	// Use the useDispatch hook to dispatch actions
	const dispatch = useDispatch();

	// Create state to manage file upload
	const [file, setFile] = useState();

	// Define the initial values for the form fields
	const initialValues = {
		title: selectedOption?.title || "",
		// description: selectedOption?.description || "",
		location: selectedOption?.location || "",
		date: selectedOption?.date || "",
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

				if (selectedOption) {
					// If editing an existing event, use the update mutation
					const res = await toast.promise(updateEvent(selectedOption._id, updatedValues).unwrap(), {
						pending: "Updating event...",
						success: "Event updated successfully",
					});
					dispatch(setEvents({ ...res }));

					// Reload the page after 5 seconds
					setTimeout(() => {
						window.location.reload();
					}, 5000);
				} else {
					// If creating a new event, use the create mutation
					const res = await toast.promise(createEvent(updatedValues).unwrap(), {
						pending: "Creating event...",
						success: "Event created successfully",
					});
					dispatch(setEvents({ ...res }));

					// Reset form and clear uploaded image
					formik.resetForm();
					setFile(null);

					// Reset the input element for file upload
					const inputElement = document.getElementById("image");
					if (inputElement) {
						inputElement.value = null;
					}
				}
				// Reload the page after 5 seconds
				setTimeout(() => {
					window.location.reload();
				}, 5000);
			} catch (error) {
				toast.error(error?.error?.response?.data?.message || error?.data?.message || error?.error)
			}
		},
	});

	// File upload handler
	const onUpload = async (e) => {
		// Check file size, must be 2MB or less
		const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB
		if (file?.size > maxSize) {
			toast.error("File size too large");

			return;
		}
		// File size is okay, convert to base64
		const base64 = await convertToBase64(e.target.files[0]);
		// Update the file state
		setFile(base64);
		
		// Update the image preview
    setImagePreview(URL.createObjectURL(file));
  };

	// Use useEffect to update form values when selectedOption changes
  useEffect(() => {
    formik.setValues({
      title: selectedOption?.title || "",
      location: selectedOption?.location || "",
      date: selectedOption?.date || "",
    });
		setFile(selectedOption?.image || file || null);
  }, [selectedOption]);

	// Function to handle event deletion
	const handleDelete = async () => {
		try {
			const res = await toast.promise(deleteEvent(selectedOption._id).unwrap(), {
				pending: "Deleting event...",
				success: "Event deleted successfully",
			});
			dispatch(setEvents({ ...res }));
			formik.resetForm();
			setFile(null);
			// Reload the page after 5 seconds
			setTimeout(() => {
				window.location.reload();
			}, 5000);
		} catch (error) {
			toast.error(error?.error?.response?.data?.message || error?.data?.message || error?.error)
		}
	}

	return (
		<form
		className="flex flex-col justify-center p-5 md:px-10 h-full"
		onSubmit={formik.handleSubmit}
		>
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

			<div className="mt-5">
				{selectedOption?.image ? (
					<>
						<img src={file || selectedOption.image} alt="Event Flyer" className="w-1/2" />
						<label htmlFor="image" className="mt-2 cursor-pointer border-2 w-fit p-2 text-white bg-black rounded-lg">
							Change Event Flyer
						</label>
						<input
							onChange={onUpload}
							type="file"
							name="image"
							id="image"
							className="p-2 bg-black text-white rounded-lg"
						/>
					</>
				) : (
					<>
					{imagePreview && (
						<img src={imagePreview} alt="Event Flyer" className="w-1/2" />
					)}
					<label htmlFor="image" className="cursor-pointer border-2 w-fit p-2 text-white bg-black rounded-lg">
						Add Event Flyer
						<input
							required
							onChange={onUpload}
							type="file"
							name="image"
							id="image"
							className="hidden"
						/>
					</label>
					</>
					
				)}
			</div>

			<div className="mt-5 flex flex-row gap-8 ml-auto">
				{isDeleting ? (
					<button className="bg-red-500 rounded-lg p-3 text-white opacity-50 cursor-not-allowed" disabled>
						Deleting...
					</button>
				) : (
					<button
					type="button"
					onClick={handleDelete}
					className="p-3 border-2 rounded-lg border-red-600 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
					>
					Delete Event
					</button>
				)}
				{isUpdating ? (
					<button className="bg-primary rounded-lg p-3 text-white opacity-50 cursor-not-allowed" disabled>
						Updating...
					</button>
				) : (
					<button
						type="submit"
						className="bg-primary rounded-lg p-3 text-white hover:bg-primary-dark transition-all duration-300"
					>
						{selectedOption ? "Update Event" : "Create Event"}
					</button>
				)}
			</div>
		</form>
	);
};

export default EventForm;

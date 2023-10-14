import { useFormik } from "formik";
import * as Yup from "yup";
import { FaXmark } from "react-icons/fa6";
import FormErrors from "./FormErrors";
import InputField from "../InputField";

const AddPayment = ({handleModalOpen}) => {
	const initialValues = {
		title: "",
		description: "",
		amount: "",
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("Please add a title"),
		description: Yup.string()
			.required("Add a payment description")
			.min(10, "Description must be at least 10 characters long"),
		amount: Yup.number().required("Amount is required"),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			console.log(values);
		},
	});

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
			<div className="bg-white p-5 w-[400px] rounded-3xl">
				<div className="rounded w-fit p-2 hover:text-white hover:bg-black place-self-end" onClick={handleModalOpen}>
					<FaXmark />
				</div>
				<form action="" onSubmit={formik.handleSubmit} className="flex flex-col ">
					<label htmlFor="title" className="pt-5">Payment Title</label>
					<InputField
						type="text"
						id="title"
						name="title"
						placeholder="Payment Title"
						value={formik.values.title}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.title && formik.errors.title ? (
						<FormErrors error={formik.errors.title} />
					) : null}

					<label htmlFor="description" className="pt-3">Payment Description</label>
					<textarea
						type="text"
						id="description"
						name="description"
						placeholder="Describe payment details"
						value={formik.values.description}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
            className="resize-none p-3 border-2 border-gray-300 rounded-lg"
					/>

					{formik.touched.description && formik.errors.description ? (
						<FormErrors error={formik.errors.description} />
					) : null}

					<label htmlFor="amount" className="pt-3">Amount</label>
					<InputField
						type="number"
						id="amount"
						name="amount"
						placeholder="Amount"
						value={formik.values.amount}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.amount && formik.errors.amount ? (
						<FormErrors error={formik.errors.amount} />
					) : null}

          <button type="submit" className="bg-primary text-white rounded-lg p-2 mt-5 hover:opacity-80">Add Payment</button>
				</form>
			</div>
		</div>
	);
};

export default AddPayment;

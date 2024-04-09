import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import {
  AdminAnnouncementCard,
  HeaderComponent,
  Sidebar,
  Loader,
} from "../components";
import {
  useCreateAnnouncementMutation,
  useAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  setAnnouncements,
} from "../redux";

const AdminAnnouncements = () => {
  // Fetch all announcements
  const { data: announcements, isLoading: isFetching } =
    useAllAnnouncementsQuery();

  // Create the createAnnouncement mutation
  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();

  // Create the deleteAnnouncement mutation
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  // Create a dispatch function
  const dispatch = useDispatch();

  // Define the initial values for the form fields
  const initialValues = {
    text: "",
  };

  // Define a state variable to track the selected "level"
  const [selectedLevel, setSelectedLevel] = useState("Non-Student");

  // manage selected state in the select dropdown
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLevel(selectedValue);
  };

  // Define a Yup validation schema for the form fields
  const validationSchema = Yup.object({
    text: Yup.string().required("Text is required"),
  });

  // Create a function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Append the selectedLevel to the formik.values
      const values = await Object.assign(formik.values, {
        level: selectedLevel,
      });

      // Dispatch the createAnnouncement action
      const res = await toast.promise(createAnnouncement(values).unwrap(), {
        pending: "Creating announcement...",
        success: "Announcement created!",
      });

      // Dispatch the setAnnouncement action
      dispatch(setAnnouncements(res));
      // Reset the form
      formik.resetForm();
    } catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error)
    }
  };

  // Define a function to handle announcement text changes
  const handleAnnouncementChange = (e, index) => {
    const { value } = e.target;
    // Clone the announcements array and update the text of the edited announcement
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index] = {
      ...updatedAnnouncements[index],
      text: value,
    };
    // Update the state with the new announcements
    // dispatch(updateAnnouncement(updatedAnnouncements));
  };

  // Handler for "Edit" button
  // const handleEditClick = (announcement) => {
  //   // Handle the edit logic for the announcement
  //   console.log("Edit announcement:", announcement);
  // };

  // Handler for "Delete" button
  const handleDeleteClick = async (announcement) => {
    // Handle the delete logic for the announcement
    const res = await toast.promise(
      deleteAnnouncement(announcement._id).unwrap(),
      {
        pending: "Deleting announcement...",
        success: "Announcement deleted!",
        error: "An error occurred while deleting the announcement"
      }
    );
    // Dispatch the setAnnouncement action
    dispatch(setAnnouncements(res));
    // Show a success toast
  };

  // Use the useFormik hook to manage the form state
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row w-full"
    >
      <Sidebar />

      <div className="w-full">
        <HeaderComponent title="Announcements" />
        <div className="flex md:flex-row gap-2 flex-col w-full">
          <div className="flex-1 hidden md:block">
            <AdminAnnouncementCard
              title="General Announcements"
              onClick={() => {
                setSelectedLevel("Non-Student");
              }}
            />
            <AdminAnnouncementCard
              title="100L Announcements"
              onClick={() => {
                setSelectedLevel("100");
              }}
            />
            <AdminAnnouncementCard
              title="200L Announcements"
              onClick={() => {
                setSelectedLevel("200");
              }}
            />
            <AdminAnnouncementCard
              title="300L Announcements"
              onClick={() => {
                setSelectedLevel("300");
              }}
            />
            <AdminAnnouncementCard
              title="400L Announcements"
              onClick={() => {
                setSelectedLevel("400");
              }}
            />
            <AdminAnnouncementCard
              title="500L Announcements"
              onClick={() => {
                setSelectedLevel("500");
              }}
            />
          </div>

          <div className="flex flex-col m-auto w-full items-center md:hidden">
            <select
              name=""
              id=""
              className="bg-black text-white w-[50%] p-2 rounded-lg"
              onChange={handleSelectChange}
            >
              <option value="Non-Student">
                General Announcements
              </option>
              <option value="100">100L Announcements</option>
              <option value="200">200L Announcements</option>
              <option value="300">300L Announcements</option>
              <option value="400">400L Announcements</option>
              <option value="500">500L Announcements</option>
            </select>
          </div>

          <div className="flex-1 border-l-2 border-l-gray-300">
            <form
              action=""
              className="flex flex-col gap-3 p-5"
              onSubmit={handleFormSubmit}
            >
              <textarea
                name="text"
                placeholder="Type in a new announcement"
                id="text"
                className="resize-none border-2 border-gray-300 p-3 rounded-lg"
                value={formik.values.text}
                onBlur={formik.handleBlur("text")}
                onChange={formik.handleChange("text")}
              />
              {formik.touched.text && formik.errors.text && (
                <div className="text-red-500">
                  {formik.errors.text}
                </div>
              )}
              <button
                className="p-2 px-3 rounded-lg bg-black text-white"
                type="submit"
              >
                Make Announcement
              </button>

              {/* The other annoucements map inside input fields where they can be edited and deleted directly */}
              <h3 className="text-xl font-semibold pt-8">
                Announcements
              </h3>
              {announcements?.map((announcement, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 mb-4"
                >
                  <textarea
                    name={`announcement${index}`}
                    id={`announcement${announcement._id}`}
                    className="resize-none border-2 border-gray-300 p-3 rounded-lg"
                    value={announcement.text} // Set the value to the announcement's text
                    onChange={(e) =>
                      handleAnnouncementChange(
                        e,
                        announcement._id
                      )
                    }
                  />
                  <div className="flex flex-row gap-5 ml-auto">
                    {/* <button
                      type="button"
                      className="p-2 px-3 rounded-lg bg-black text-white"
                      onClick={() =>
                        handleEditClick(
                          announcement
                        )
                      }
                    >
                      Edit
                    </button> */}
                    <button
                      type="button"
                      className="p-2 px-3 rounded-lg bg-red-500 text-white"
                      onClick={() =>
                        handleDeleteClick(
                          announcement
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </form>
            {isFetching || isCreating || (isDeleting && <Loader />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAnnouncements;

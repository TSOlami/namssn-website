import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AdminAnnouncementCard, HeaderComponent, Sidebar, Loader } from "../components";
import { useCreateAnnouncementMutation, useAllAnnouncementsQuery, useUpdateAnnouncementMutation, useDeleteAnnouncementMutation, setAnnouncements } from "../redux";

const AdminAnnouncements = () => {
  // Fetch all announcements
  const { data: announcements, isLoading: isFetching } = useAllAnnouncementsQuery();

  // Create the createAnnouncement mutation
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();

  // Create a dispatch function
  const dispatch = useDispatch();

  // Define the initial values for the form fields
  const initialValues = {
    text: "",
  };

  // Define a state variable to track the selected "level"
  const [selectedLevel, setSelectedLevel] = useState('Non-Student');

  
  // Define a Yup validation schema for the form fields
  const validationSchema = Yup.object({
    text: Yup.string().required("Text is required"),
  });
  
  // Create a function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Append the selectedLevel to the formik.values
    const values = Object.assign( formik.values, { level: selectedLevel });

    console.log("Submitted values:", values);
    // Dispatch the createAnnouncement action
    const res = await createAnnouncement(values).unwrap();
    console.log("Response:", res);
    // Dispatch the setAnnouncement action
    dispatch(setAnnouncements(res));
    // Reset the form
    formik.resetForm();
    // Show a success toast
    toast.success("Announcement created!");
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.log("Error:", err?.data?.message || err?.error);
    }
  };

  // Define a function to handle announcement text changes
  const handleAnnouncementChange = (e, index) => {
    const { name, value } = e.target;
    // Clone the announcements array and update the text of the edited announcement
    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index] = { ...updatedAnnouncements[index], text: value };
    // Update the state with the new announcements
    // This may vary depending on how you've set up your state management
    // For example, if using Redux, you'd dispatch an action to update the state
    // dispatch(updateAnnouncement(updatedAnnouncements));
  };
  
  // Handler for "Edit" button
  const handleEditClick = (announcement) => {
    // Handle the edit logic for the announcement
    console.log("Edit announcement:", announcement);
  };

  // Handler for "Delete" button
  const handleDeleteClick = (announcement) => {
    // Handle the delete logic for the announcement
    console.log("Delete announcement:", announcement);
  };

  
  // Use the useFormik hook to manage the form state
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="flex flex-row w-full">
      <Sidebar />

      <div className="w-full">
        <HeaderComponent title="Announcements" />
        <div className="flex flex-row gap-2 w-full">
          <div className="flex-1">
            <AdminAnnouncementCard 
            title="General Announcements"
            onClick={() => {
              setSelectedLevel('Non-Student');
              console.log("Selected level: Non-Student");
            }}
           />
            <AdminAnnouncementCard title="100L Announcements"
            onClick={() => {
            setSelectedLevel('100');
            console.log("Selected level: 100L");
            }}
            />
            <AdminAnnouncementCard title="200L Announcements" 
            onClick={() => {
              setSelectedLevel('200');
              console.log("Selected level: 200L");
            }}
            />
            <AdminAnnouncementCard title="300L Announcements" 
            onClick={() => {
              setSelectedLevel('300');
              console.log("Selected level: 300L");
            }}
            />
            <AdminAnnouncementCard title="400L Announcements" 
            onClick={() => {
              setSelectedLevel('400');
              console.log("Selected level: 400L");
            }}
            />
            <AdminAnnouncementCard title="500L Announcements"
            onClick={() => {
              setSelectedLevel('500');
              console.log("Selected level: 500L");
            }}
            />
          </div>

          <div className="flex-1 border-l-2 border-l-gray-300">
          <form action="" className="flex flex-col gap-3 p-5" onSubmit={handleFormSubmit}>
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
                <div className="text-red-500">{formik.errors.text}</div>
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
                    id={`announcement${index}`}
                    className="resize-none border-2 border-gray-300 p-3 rounded-lg"
                    value={announcement.text}  // Set the value to the announcement's text
                    onBlur={formik.handleBlur(`announcement${index}`)}
                    onChange={(e) => handleAnnouncementChange(e, index)}
                  />
                  <div className="flex flex-row gap-5 ml-auto">
                    <button
                      className="p-2 px-3 rounded-lg bg-black text-white"
                      onClick={() => handleEditClick(announcement, index)}
                    >
                      Edit
                    </button>
                    <button
                      className="p-2 px-3 rounded-lg bg-red-500 text-white"
                      onClick={() => handleDeleteClick(announcement, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </form>
                {isFetching || isCreating && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;

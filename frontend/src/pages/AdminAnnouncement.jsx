import { useFormik } from "formik";
import * as Yup from "yup";
import { AdminAnnouncementCard, HeaderComponent, Sidebar } from "../components";
import { mockAnnouncements } from "../data";

const AdminAnnouncements = () => {
  const initialValues = {
    text: "",
    level: "Non-Student",
  };
  
  // Define a Yup validation schema for the form fields
  const validationSchema = Yup.object({
    text: Yup.string().required("Text is required"),
    level: Yup.string().required("Level is required"),
  });
  
  // Create a function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform the submission logic here, e.g., make an API request
    console.log("Submitted values:", formik.values);
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
            onClick={() => formik.setFieldValue("level", "Non-Student")}
           />
            <AdminAnnouncementCard title="100L Announcements"
            onClick={() => formik.setFieldValue("level", "100")}
            />
            <AdminAnnouncementCard title="200L Announcements" 
            onClick={() => formik.setFieldValue("level", "200")}
            />
            <AdminAnnouncementCard title="300L Announcements" 
            onClick={() => formik.setFieldValue("level", "300")}
            />
            <AdminAnnouncementCard title="400L Announcements" 
            onClick={() => formik.setFieldValue("level", "400")}
            />
            <AdminAnnouncementCard title="500L Announcements"
            onClick={() => formik.setFieldValue("level", "500")}
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
              {mockAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 mb-4"
                >
                  <textarea
                    name="announcement"
                    placeholder="Type in a new announcement"
                    id="announcement"
                    className="resize-none border-2 border-gray-300 p-3 rounded-lg"
                    value={formik.values.text}
                    onBlur={formik.handleBlur("anouncement")}
                    onChange={formik.handleChange("announcement")}
                  />
                  <div className="flex flex-row gap-5 ml-auto">
                    <button
                      className="p-2 px-3 rounded-lg bg-black text-white"
                      onClick={() => handleEditClick(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="p-2 px-3 rounded-lg bg-red-500 text-white"
                      onClick={() => handleDeleteClick(announcement)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;

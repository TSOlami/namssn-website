import { useState } from "react";
import { toast } from "react-toastify";

import { Loader } from "../../components"
import { useContactUsMutation } from "../../redux";
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactUs, { isLoading }] = useContactUsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await toast.promise(contactUs(formData), {
      pending: "Sending message...",
      success: "Message sent successfully.",
      error: "Failed to send message. Please try again.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-merriweather font-bold md:text-3xl leading-normal pt-16 text-xl text-center max-w-xl mx-auto mb-4">Reach Out to Us</h2>
      <form className="lg:px-12 px-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Topic of inquiry"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="How may we help you?"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="button-2"
          >
            Send Message
          </button>
          {isLoading && (<Loader />)}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

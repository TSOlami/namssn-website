import { useState } from "react";
import { toast } from "react-toastify";

import { Modal } from "../components";
import { useMailNoticeMutation } from "../redux";

const SendMailModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
	const [sendTo, setSendTo] = useState("email");

	// Mutation to send mail
	const [sendMailNotice] = useMailNoticeMutation();

  const handleSendMail = async () => {
    try {
			// Use the sendMailNotice util function to send mail
			await toast.promise(sendMailNotice({ subject, text, selectedLevel, sendTo }), {
				pending: "Sending mail...",
				success: "Mail sent successfully",
			});	
		} catch (error) {
			const msg = error?.error?.response?.data?.message || error?.data?.message || error?.error;
			toast.error(msg);
		}
    onClose(); // Close the modal after sending mail
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Mail">
			<div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Select Email Type</label>
        <select
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="email">Users Regular Email</option>
          <option value="studentEmail">Verified Student Email</option>
        </select>
      </div>
      <div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
					required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Text</label>
        <textarea
          value={text}
					required
          onChange={(e) => setText(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          rows="4"
        />
      </div>
      <div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Select Level</label>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="100">Level 100</option>
          <option value="200">Level 200</option>
          <option value="300">Level 300</option>
          <option value="400">Level 400</option>
          <option value="500">Level 500</option>
          <option value="all">All Levels</option>
        </select>
      </div>
      <button onClick={handleSendMail} className="bg-primary text-white p-2 rounded-md">
        Send Mail
      </button>
    </Modal>
  );
};

export default SendMailModal;

import { useState } from "react";
import { Modal } from "../components";
import { sendMailNotice } from "../utils";

const SendMailModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
	const [sendTo, setSendTo] = useState("email");

  const handleSendMail = () => {
    // Assuming you have a function in your redux actions to send mail
    // sendMailNotice({ subject, text, selectedLevel, sendTo });
		console.log({ subject, text, selectedLevel, sendTo });
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
          <option value="user">User Email</option>
          <option value="student">Student Email</option>
        </select>
      </div>
      <div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4 mx-12">
        <label className="block text-sm font-medium text-gray-700">Text</label>
        <textarea
          value={text}
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

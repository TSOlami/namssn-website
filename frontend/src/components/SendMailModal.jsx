import { useState } from "react";
import { toast } from "react-toastify";

import { Modal, Select } from "../components";
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
        <Select
          label="Select Email Type"
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          options={[
            { value: "email", label: "Users Regular Email" },
            { value: "studentEmail", label: "Verified Student Email" },
          ]}
        />
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
        <Select
          label="Select Level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          options={[
            { value: "100", label: "Level 100" },
            { value: "200", label: "Level 200" },
            { value: "300", label: "Level 300" },
            { value: "400", label: "Level 400" },
            { value: "500", label: "Level 500" },
            { value: "all", label: "All Levels" },
          ]}
        />
      </div>
      <button onClick={handleSendMail} className="bg-primary text-white p-2 rounded-md">
        Send Mail
      </button>
    </Modal>
  );
};

export default SendMailModal;

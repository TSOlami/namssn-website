import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../components";
import { useSendUserMailMutation } from "../redux";

const SendPersonalMailModal = ({ isOpen, onClose, userId, userName }) => {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [sendUserMail, { isLoading }] = useSendUserMailMutation();

  const handleSend = async () => {
    if (!subject.trim() || !text.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    try {
      await sendUserMail({ userId, subject: subject.trim(), text: text.trim() }).unwrap();
      toast.success("Email sent successfully.");
      setSubject("");
      setText("");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send email.");
    }
  };

  const handleClose = () => {
    setSubject("");
    setText("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Send personal mail to {userName || "user"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your message..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Sending…" : "Send"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SendPersonalMailModal;

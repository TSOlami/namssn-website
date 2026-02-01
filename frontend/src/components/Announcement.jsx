import { FaCircleCheck } from "react-icons/fa6";

const Announcement = ({ name, text, isVerified }) => {

  return (
    <div className="py-4">
      <div className="relative flex flex-row items-center gap-2 font-semibold py-1">{name} {isVerified && <FaCircleCheck color="#17A1FA"/>} </div>
      <div className="break-words">{text}</div>
    </div>
  )
}

export default Announcement
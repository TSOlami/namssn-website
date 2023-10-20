import { FaCircleCheck } from "react-icons/fa6"

const Announcement = ({ name, text, isVerified,}) => {
  return (
    <div className="py-4">
      <div className="flex flex-row items-center gap-2 font-semibold py-1">{name} {isVerified && <FaCircleCheck color="#17A1FA"/>}</div>
      <div>{text}</div>
    </div>
  )
}

export default Announcement
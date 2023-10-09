import { FaCircleCheck } from "react-icons/fa6"

const Announcement = ({title, content}) => {
  return (
    <div className="bg-greyish rounded-[2rem] p-4 my-4">
      <h1 className="text-xl font-bold py-3">{title}</h1>
      <div>
        {content?.map((text, index) => {
          return <div key={index} className="py-4">
            <div className="flex flex-row items-center gap-2 font-semibold py-1">{text.user} {text.isAdmin && <FaCircleCheck color="#17A1FA"/>}</div>
            <div>{text.content}</div>
          </div>
        })}
      </div>


    </div>
  )
}

export default Announcement
import { FaAngleRight } from "react-icons/fa6"

const PaymentDetails = ( { title, amount}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-4 active:border-l-4 active:bg-blue-200 active:border-l-primary p-3 w-full">
      <h1 className="font-medium text-lg w-[200px] pl-2">{title}</h1>
      <div className="text-primary font-semibold text-lg">{amount}</div>
      <FaAngleRight />
    </div>
  )
}

export default PaymentDetails
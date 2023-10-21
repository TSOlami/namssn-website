// import PaymentForm from "../components/Payment";
import { PaymentList, AnnouncementContainer,Sidebar } from "../components"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";



const PaymentPage = () => {
    const { userInfo } = useSelector((state) => state.auth);



    return (
        <div className="flex flex-row">
            <Sidebar />
            <Link className="bg-blue-200 p-2 text-white rounded-lg hover:bg-slate-700 my-5"
                  to={`/payments/${userInfo._id}`}
                >
                  View Payments History
                </Link>
            <div className="flex flex-row w-full h-full ">
                    <PaymentList />
                </div>
                <div className="flex flex-col">
                    <AnnouncementContainer />
                </div>
           
        </div>
    );
    }
export default PaymentPage;
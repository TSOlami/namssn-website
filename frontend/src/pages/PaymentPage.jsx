// import PaymentForm from "../components/Payment";
import { PaymentList, AnnouncementContainer,Sidebar } from "../components"
const PaymentPage = () => {
    return (
        <div className="flex flex-row">
            <Sidebar />

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
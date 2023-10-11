import {HeaderComponent, AnnouncementContainer} from "../components"
import {Sidebar} from "../components";
import {ResourceCard} from "../components"
import Upload from "../assets/Upload.png";

const Resources = () => {
    return (
        <div>
            <div className="flex">
                <Sidebar/>
                <div className="lg:w-[65%] sm:w-[100%]">
                    <HeaderComponent name="Resources"/>
                    <div className="lg:pt-5 gap:4 w-[100%]">
                        <span className="px-4 pb-4 font-bold font-crimson text-xl">YEAR 1 FIRST SEMESTER</span>
                        <div className="px-4 flex flex-wrap gap-4 justify-items-start">
                            <ResourceCard course="Mathematics"/>
                            <ResourceCard course="English"/>
                            <ResourceCard course="Physics"/>
                            <ResourceCard course="Chemistry"/>
                            <ResourceCard course="Mathematics"/>
                            <ResourceCard course="Economics"/> 
                            <ResourceCard course="Fishery"/>
                            <ResourceCard course="Agric"/>
                            <ResourceCard course="English"/>
                            <ResourceCard course="Mathematics"/>          
                        </div>
                        <button className="ring-4 fixed bottom-4 right-4 md:right-8 lg:right-[30%] xl:right-[30%] z-10 bg-green-600 text-white py-2 px-4 rounded-full">
                            <img className="lg:w-[30px]" src={Upload}/>
                        </button>
                    </div>
                </div>
                <div className="w-[35%] sm:hidden md: hidden lg:block"> 
                    <AnnouncementContainer/>
                </div>
            </div>
        </div>
    );
}

export default Resources;
// import { Sidebar, PageBox } from "../components"

// const divStyle = {
//     display: "flex"
// }

// const mainStyle = {
//     width: "60%",
//     height: "100",
//     backgroundColor: "#FFFFFF",
//     borderRight: "1px solid #B3B3B3",
// }

// const Resources = () => {
//     return (
//         <div style={divStyle}>
//             <Sidebar/>
//             <div style={mainStyle}>
//                 <PageBox name="Learning Resources" />
//                 <main></main>
//             </div>
//         </div>
//     )
// }

// export default Resources;
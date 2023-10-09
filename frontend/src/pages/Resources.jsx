import { Sidebar, PageBox } from "../components"

const divStyle = {
    display: "flex"
}

const mainStyle = {
    width: "60%",
    height: "100",
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #B3B3B3",
}

const Resources = () => {
    return (
        <div style={divStyle}>
            <Sidebar/>
            <div style={mainStyle}>
                <PageBox name="Learning Resources" />
                <main></main>
            </div>
        </div>
    )
}

export default Resources;
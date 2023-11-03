import { searchIcon } from "../assets";
import "../index.css"
const style = {
    width: '100',
    height: '100%',
    fontFamily: "Crimson Text",
    marginLeft: "2%",
    marginRight: "2%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
}

const PageBox = (props) => {
    return (
        <div style={{borderBottom: "1px solid #B3B3B3", height: "10%"}}>
            <div style={style}>
                <span> {props.name} </span>
                <div className="search" >
                    <img
                        src= {searchIcon}
                        style={{display: "inline", width: "20px", height: "20px", marginLeft: "10px", marginRight: "15px"}}
                    />
                    <span> Search </span>
                </div>
            </div>
        </div>
    )
}

export default PageBox;
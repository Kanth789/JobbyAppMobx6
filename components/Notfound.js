import Header from "./Header";
import './Notfound.css';
export const Notfound = ()=>{
    return(
        <>
        <Header/>
        <div className="imge-conatiner">
      <div className="image">
        <img src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png" alt="not found"/>
        <div className="img-text">
        Not Found
    </div>
    </div>
    </div>
    </>
    )
}
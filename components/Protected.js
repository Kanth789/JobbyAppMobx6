import Cookies from "js-cookie";
import { Redirect } from 'react-router-dom';

import { BrowserRouter,Route ,Switch} from 'react-router-dom';
const ProctetedRoute = (props) =>{
    const jwtToken = Cookies.get('jwt_token')
    
    console.log(jwtToken)
    if(jwtToken === undefined)
    {
        return <Redirect to="/login"/>
    }
    return <Route {...props}></Route>
};
export default ProctetedRoute
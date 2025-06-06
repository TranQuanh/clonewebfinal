import {Navigate} from "react-router-dom";

const RequireLogin = ({user,children}) => {
    return user ? children: <Navigate to="/login" replace/>
}
export default RequireLogin;
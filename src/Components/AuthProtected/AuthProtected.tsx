import { useContext, type ReactNode } from "react"
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider"
import { Navigate } from "react-router"

function AuthProtected({children} : {children : ReactNode}) {
    const {userData} = useContext(userAuthContext)

    if(userData){
        return <Navigate to={'/'}/>
    }
    return children
}

export default AuthProtected

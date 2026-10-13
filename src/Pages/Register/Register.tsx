import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";
import RegisterForm from "./RegisterForm";
function Register() {
 useDocumentTitle("Register");
 return (
    <>
      <h1 className="text-main-color text-7xl text-center font-bold">
        Register
      </h1>
      <RegisterForm />
    </>
  );
}

export default Register;

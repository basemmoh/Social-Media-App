import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";
import RegisterForm from "./RegisterForm";
function Register() {
  useDocumentTitle("Register");
  return (
    <div className="w-full max-w-2xl px-3">
      <h1 className="text-main-color text-5xl sm:text-7xl text-center font-bold">
        Register
      </h1>
      <RegisterForm />
    </div>
  );
}

export default Register;

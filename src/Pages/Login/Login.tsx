import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";
import LoginForm from "./LoginForm";

function Login() {
  useDocumentTitle("Login");
  return (
    <>
      <h1 className="text-main-color text-center font-semibold my-10 text-5xl">
        Login
      </h1>
      <LoginForm />
    </>
  );
}

export default Login;

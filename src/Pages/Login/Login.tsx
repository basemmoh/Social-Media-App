import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";
import LoginForm from "./LoginForm";

function Login() {
  useDocumentTitle("Login");
  return (
    <div className="w-full max-w-2xl px-3">
      <h1 className="text-main-color text-center font-semibold my-10 text-4xl sm:text-5xl">
        Login
      </h1>
      <LoginForm />
    </div>
  );
}

export default Login;

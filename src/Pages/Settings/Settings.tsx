import { Key } from "iconsax-reactjs";
import ChangePasswordForm from "./ChangePasswordForm";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle/useDocumentTitle";

function Settings() {
  useDocumentTitle("Settings");
  return (
    <div className="w-full px-3 pb-10 ">
      <div className="flex justify-center items-center gap-5 ">
        <Key size="32" color="#2ccce4" />
        <div>
          <h1 className="text-3xl mb-2 font-bold">
            Change Password
          </h1>
          <p className="text-gray-600 mb-5">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>
      <ChangePasswordForm />
    </div>
  );
}

export default Settings;

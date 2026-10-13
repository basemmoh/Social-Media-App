import React, { createContext, useEffect, useState } from "react";
import type {
  userAuthContextType,
  UserData,
} from "./UserAuthProvider.inteface";
import { getUserData } from "./UserAuthProvider.services";

export const userAuthContext = createContext<userAuthContextType>({
  userData: null,
  setUserData: () => {},
});

function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
     if (!localStorage.getItem("user_tkn")) return;
     getUserData().then(setUserData);
   }, []);

  return (
    <userAuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </userAuthContext.Provider>
  );
}

export default UserAuthProvider;

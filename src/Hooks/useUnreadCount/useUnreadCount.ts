import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { getUnreadCount } from "../../Pages/Notifications/Notifications.services";

export function useUnreadCount() {
  const { userData } = useContext(userAuthContext);
  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getUnreadCount,
    enabled: !!userData,
    refetchInterval: 30_000, // checks for new notifications every 30 seconds
  });
}
import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "../../Pages/PostDetails/PostDetails.services";

export function usePostDetails(id: string | undefined) {
    const { data, isLoading, isError, error } = useQuery({
    queryKey: ["PostDetails" ,id],
    queryFn: () => getSinglePost(id!),
  });
  return { data, isLoading, isError, error };
}
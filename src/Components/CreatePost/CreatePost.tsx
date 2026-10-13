import { Avatar, Card, Input } from "@heroui/react";
import { DocumentUpload } from "iconsax-reactjs";
import AppButton from "../../SharedComponent/AppButton/AppButton";
import type { UserData } from "../../Context/UserAuthProvider/UserAuthProvider.inteface";
import { useForm } from "react-hook-form";
import { createPost } from "./CreatePost.services";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PrivacySelect from "../PrivacySelect/PrivacySelect";

function CreatePost({ userData }: { userData: UserData }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });
  const [privacy, setPrivacy] = useState("public");
  const [uploadImage, setUploadImage] = useState<string | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  async function handleUserPost(data: { body: string }) {
    const formData = new FormData();
    formData.append("body", data.body);
    formData.append("privacy", privacy);
    if (imgSrc) {
      formData.append("image", imgSrc);
    }
    toast.promise(mutateAsync(formData), {
      loading: "Creating Post...",
      success: (res) => {
        reset();
        setUploadImage(undefined);
        setImgSrc(null);
        if (inputUploadFile.current) inputUploadFile.current.value = "";
        return res;
      },
    });
  }

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allPosts"] }),
  });
  const inputUploadFile = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="max-w-3xl mx-3 shadow-2xl bg-main-color/40">
      <Card.Header>
        <Card.Title className="flex items-center gap-3 pb-3 border-b mb-3">
          Hello {userData.name}, What's on your mind?
        </Card.Title>

        <form onSubmit={handleSubmit(handleUserPost)}>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex gap-3 w-full">
              <Avatar>
                <Avatar.Image alt={userData.name} src={userData.photo} />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>

              <Input
                {...register("body")}
                className="grow"
                placeholder="What's on your mind?"
              />
              <div className="w-full">
                <PrivacySelect value={privacy} onChange={setPrivacy} />
              </div>
              <DocumentUpload
                onClick={(_) => inputUploadFile.current?.click()}
                size="32"
                color="#2ccce4"
              />
              <Input
                onChange={(e) => {
                  setImgSrc(e.target.files![0]);
                  setUploadImage(URL.createObjectURL(e.target.files![0]));
                }}
                type="file"
                className="hidden"
                ref={inputUploadFile}
              />
            </div>
            <img src={uploadImage} alt="" />
            <AppButton className="mt-5 w-full" type="submit">
              Create Post
            </AppButton>
          </div>
        </form>
      </Card.Header>
    </Card>
  );
}

export default CreatePost;

import { Avatar, Card, Input } from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { userAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import AppButton from "../../SharedComponent/AppButton/AppButton";
import { DocumentUpload } from "iconsax-reactjs";
import { useCreateComment } from "../../Hooks/useCreateComment/useCreateComment";

function CreateComment({ postId }: { postId: string }) {
  const { userData } = useContext(userAuthContext);

  const inputUploadFile = useRef<HTMLInputElement | null>(null);
  const [uploadImage, setUploadImage] = useState<string | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<File | null>(null);

  const mutateAsync = useCreateComment(imgSrc, postId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: { content: string }) {
    try {
      await mutateAsync(data);
      reset(); 
      setUploadImage(undefined); 
      setImgSrc(null); 
      if (inputUploadFile.current) inputUploadFile.current.value = ""; 
    } catch {
    }
  }
  return (
    <>
      <Card className="w-full shadow-2xl bg-main-color/30">
        <Card.Header>
          <Card.Title className="flex items-center gap-3 pb-3 border-b mb-3">
            Hello {userData?.name}, What's on your mind?
          </Card.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 items-center">
              <div className="flex gap-3 w-full">
                <Avatar>
                  <Avatar.Image alt={userData?.name} src={userData?.photo} />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar>

                <Input
                  {...register("content")}
                  className="grow"
                  placeholder="What's on your mind?"
                />
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
              {uploadImage && <img src={uploadImage} alt="" />}{" "}
              <AppButton className="mt-5 w-full" type="submit">
                Create Comment
              </AppButton>
            </div>
          </form>
        </Card.Header>
      </Card>
    </>
  );
}

export default CreateComment;

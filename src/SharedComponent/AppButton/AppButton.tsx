import { Button } from "@heroui/react";
import React from "react";
function AppButton({ children, ...prop }: React.ComponentProps<typeof Button>) {
  return <Button {...prop}>{children}</Button>;
}

export default AppButton;

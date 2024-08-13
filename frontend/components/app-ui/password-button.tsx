import { Button } from "@/components/ui/button";

export default function PasswordButton(props: {}) {
  return (
    <div className={"h-max w-full flex justify-end p-1"}>
      <Button>Change Password</Button>
    </div>
  );
}
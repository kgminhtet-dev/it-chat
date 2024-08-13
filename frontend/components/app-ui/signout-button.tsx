import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <div className={'absolute z-50 top-1 right-1'}>
      <Button variant={"outline"}>Signout</Button>
    </div>
  );
}

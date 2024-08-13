import { Button } from "@/components/ui/button";

export default function DeactivateButton(props: {}) {
  return (
    <div className={"h-max flex justify-between items-center border-b p-1 shadow-sm"}>
      <p>Deactivating your account means you can recover it at any time after taking this action.</p>
      <Button variant={'destructive'}>Deactivate Account</Button>
    </div>
  );
}
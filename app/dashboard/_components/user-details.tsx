import React from "react";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const UserDetails = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="p-2 border flex justify-between items-center rounded">
      <div className="font-semibold">{user?.fullName}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown size="16px" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutButton signOutCallback={() => router.push("/")}>
              Logout
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDetails;

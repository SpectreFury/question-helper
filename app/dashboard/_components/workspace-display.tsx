import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import WorkspaceItem from "./workspace-item";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

const WorkspaceDisplay = () => {
  const { user } = useUser();

  if (!user) return;

  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const workspaces = useQuery(api.workspace.getWorkspaces, {
    userId: user?.id,
  });
  const router = useRouter();

  return (
    <div className="p-2 border rounded">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Your workspaces</div>
        <Button
          variant="ghost"
          onClick={async () => {
            const workspaceId = await createWorkspace({
              name: "Untitled",
              user: user.id,
            });
            router.push(`/dashboard/${workspaceId}`);
          }}
        >
          <Plus size="16px" />
        </Button>
      </div>
      {workspaces?.map((workspace) => (
        <WorkspaceItem workspace={workspace} />
      ))}
    </div>
  );
};

export default WorkspaceDisplay;

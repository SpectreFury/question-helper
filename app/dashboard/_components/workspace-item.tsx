import React from "react";
import { useWorkspaceStore } from "@/store/workspace";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { Workspace } from "@/store/workspace";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

const WorkspaceItem = ({ workspace }: { workspace: Workspace }) => {
  const { setWorkspace } = useWorkspaceStore();
  const router = useRouter();
  const { workspaceId } = useParams();

  const { user } = useUser();
  const deleteWorkspace = useMutation(api.workspace.deleteWorkspace);

  if (!user) return;

  return (
    <div
      key={workspace._id}
      className="hover:bg-gray-100 hover:dark:bg-gray-800 cursor-pointer p-2 rounded flex justify-between items-center"
      onClick={() => {
        setWorkspace({
          _id: workspace._id,
          name: workspace.name,
          user: user.id,
          questions: workspace.questions,
          quiz: workspace.quiz,
        });
        router.push(`/dashboard/${workspace._id}`);
      }}
    >
      <div className={`${workspaceId === workspace._id && "font-semibold"}`}>
        {workspace.name}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="hover:text-red-500"
        onClick={() =>
          deleteWorkspace({ workspaceId: workspace._id as Id<"workspaces"> })
        }
      >
        <Trash size="16px" />
      </Button>
    </div>
  );
};

export default WorkspaceItem;

import React from "react";
import { useWorkspaceStore } from "@/store/workspace";
import { useRouter, useParams } from "next/navigation";

interface WorkspaceItemProps {
  _id: string;
  name: string;
}

const WorkspaceItem = ({ workspace }: { workspace: WorkspaceItemProps }) => {
  const { setWorkspace } = useWorkspaceStore();
  const router = useRouter();
  const { workspaceId } = useParams();

  return (
    <div
      key={workspace._id}
      className="hover:bg-gray-100 cursor-pointer p-2 rounded"
      onClick={() => {
        setWorkspace({ _id: workspace._id, name: workspace.name });
        router.push(`/dashboard/${workspace._id}`);
      }}
    >
      <div className={`${workspaceId === workspace._id && "font-semibold"}`}>
        {workspace.name}
      </div>
    </div>
  );
};

export default WorkspaceItem;

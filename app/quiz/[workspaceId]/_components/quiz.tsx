"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/store/workspace";
import QuizItem from "./quiz-item";
import { useCarouselStore } from "@/store/carousel";
import { Workspace, useWorkspaceStore } from "@/store/workspace";

const Quiz = () => {
  const { toast } = useToast();
  const { currentItem } = useCarouselStore();
  const { setWorkspace, currentWorkspace } = useWorkspaceStore();

  const { workspaceId }: { workspaceId: Id<"workspaces"> } = useParams();

  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });
  console.log("Workspace", workspace);
  console.log(currentWorkspace);

  useEffect(() => {
    if (!workspace) return;

    setWorkspace(workspace);
  }, [workspace]);

  const getMarks = () => {
    let totalMarks = 0;

    currentWorkspace?.quiz?.map((quizItem: Quiz) => {
      const selected = quizItem.selectedAnswer?.replace(/[^a-zA-Z0-9 ]/g, "");
      const correct = quizItem.correctAnswer
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
      console.log("selected answer", selected);
      console.log("correct answer", correct);

      if (selected?.includes(correct)) {
        totalMarks = totalMarks + 1;
      }
    });

    toast({
      title: `You scored ${totalMarks} out of ${workspace.quiz.length}`,
      description: "Try again",
    });
  };

  return (
    <div className="w-full flex justify-center items-center h-full flex-col">
      <div>
        {currentWorkspace?.quiz?.map((quizItem: Quiz, index: number) => {
          return (
            index === currentItem && (
              <QuizItem
                workspaceId={workspaceId}
                quizItem={quizItem}
                quizLength={workspace.quiz.length}
              />
            )
          );
        })}
      </div>
      <Button onClick={getMarks}>Submit</Button>
    </div>
  );
};

export default Quiz;

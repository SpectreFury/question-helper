"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import QuizItem from "./quiz-item";
import { useCarouselStore } from "@/store/carousel";
import { Workspace, useWorkspaceStore, Quiz } from "@/store/workspace";
import { useMutation } from "convex/react";

const Quiz = () => {
  const { toast } = useToast();
  const { currentItem } = useCarouselStore();
  const { setWorkspace, currentWorkspace } = useWorkspaceStore();

  const { workspaceId }: { workspaceId: Id<"workspaces"> } = useParams();
  const saveQuiz = useMutation(api.workspace.saveQuiz);

  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });

  useEffect(() => {
    if (!workspace) return;

    setWorkspace(workspace);
  }, [workspace]);

  const getMarks = async () => {
    if (!currentWorkspace) return;

    let totalMarks = 0;

    currentWorkspace?.quiz?.map((quizItem: Quiz) => {
      const selected = quizItem.selectedAnswer?.replace(/[^a-zA-Z0-9 ]/g, "");
      const correct = quizItem.correctAnswer
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();

      if (!selected) return;

      if (correct.includes(selected)) {
        totalMarks = totalMarks + 1;
      }
    });

    toast({
      title: `You scored ${totalMarks} out of ${workspace.quiz.length}`,
      description: "Try again",
    });

    await saveQuiz({
      workspaceId: workspaceId as Id<"workspaces">,
      quiz: currentWorkspace.quiz,
    });
    console.log("Saved to database");
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

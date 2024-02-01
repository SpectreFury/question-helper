"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/store/workspace";
import QuizItem from "./quiz-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCarouselStore } from "@/store/carousel";
import { Workspace } from "@/store/workspace";

const Quiz = () => {
  const { toast } = useToast();
  const { currentItem } = useCarouselStore();

  const { workspaceId }: { workspaceId: Id<"workspaces"> } = useParams();
  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });

  const getMarks = () => {
    let totalMarks = 0;

    workspace.quiz.map((quizItem: Quiz) => {
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
        {workspace?.quiz.map((quizItem: Quiz, index: number) => {
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
      {/* <div>
        <Carousel className="max-w-[800px]">
          <CarouselItem>
            <CarouselContent>
              {workspace?.quiz?.map((quizItem: Quiz) => (
                <QuizItem workspaceId={workspaceId} quizItem={quizItem} />
              ))}
            </CarouselContent>
          </CarouselItem>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
        <Button className="self-start">Submit MCQ</Button>
      </div> */}
      <Button onClick={getMarks}>Submit</Button>
    </div>
  );
};

export default Quiz;

"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { model, convertQuizArrayToObjectArray } from "@/utils/gemini-api";
import { ButtonLoading } from "@/components/button-loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Workspace, Quiz } from "@/store/workspace";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TopicForm = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const { workspaceId } = useParams();
  const router = useRouter();

  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });

  const saveQuestions = useMutation(api.workspace.saveQuestions);
  const saveQuiz = useMutation(api.workspace.saveQuiz);
  const saveWorkspaceName = useMutation(api.workspace.saveWorkspaceName);

  const saveName = async () => {
    await saveWorkspaceName({
      workspaceId: workspaceId as Id<"workspaces">,
      workspaceName,
    });
  };

  const getQuizResponse = async () => {
    const PROMPT =
      "Give me multiple choice questions and the correct answer below each question from the following text:";
    const result = await model.generateContent(`${PROMPT} ${topic}`);
    const response = result.response;

    const text = await response.text();
    const responseList = text.split("\n");
    const filteredQuizList = responseList.filter((item) => item !== "");

    const quizList = convertQuizArrayToObjectArray(filteredQuizList);

    console.log("RAW format: ", filteredQuizList);
    console.log("Object format:", quizList);

    await saveQuiz({
      workspaceId: workspaceId as Id<"workspaces">,
      quiz: quizList,
    });

    router.push(`/quiz/${workspaceId}`);
  };

  const getResponse = async () => {
    setLoading(true);
    const QUESTION_PROMPT =
      "Give a few questions that could appear in a test from following text: ";
    const ANSWER_PROMPT = "Give me the answers to the following questions:";

    const questionResult = await model.generateContent(
      `${QUESTION_PROMPT} ${topic}`
    );
    const questionResponse = questionResult.response;

    const questions = await questionResponse.text();
    const questionList = questions.split(/\r?\n/);
    const filteredQuestions = questionList.filter(
      (question) => question !== ""
    );

    console.log("QUESTIONS: ", questions);
    const answerResult = await model.generateContent(
      `${ANSWER_PROMPT} ${questions}. Give the answers from the following text: ${topic}`
    );
    const answerResponse = answerResult.response;

    const answers = await answerResponse.text();
    const answerList = answers.split(/\r?\n/);
    const filteredAnswers = answerList.filter((answer) => answer !== "");
    const filteredQuestionPairs = filteredQuestions.map(
      (filteredQuestion, i) => ({
        question: filteredQuestion,
        answer: filteredAnswers[i],
      })
    );

    await saveQuestions({
      workspaceId: workspaceId as Id<"workspaces">,
      questions: filteredQuestionPairs,
    });

    console.log("ANSWERS: ", answers);
    setLoading(false);
  };

  return (
    <div className="mt-10 flex flex-col gap-2">
      <div className="flex items-center">
        <div className="text-xl font-bold">{workspace?.name}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <Edit size="20px" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit workspace title</DialogTitle>
              <DialogDescription>
                Edit the name of the workspace
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="name">Workspace name</Label>
              <Input
                type="text"
                id="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={saveName}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Textarea
        placeholder="Paste the topic you want the questions generated of"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <div className="flex gap-2">
        {loading ? (
          <ButtonLoading className="self-start" />
        ) : (
          <Button className="self-start" onClick={getResponse}>
            Generate
          </Button>
        )}
        <Button variant="outline" onClick={getQuizResponse}>
          Take MCQ
        </Button>
      </div>
      {!workspace?.questions?.length ? (
        <div className="flex flex-col items-center mt-[100px] gap-6">
          {" "}
          <Image
            src="/empty-light.svg"
            width={250}
            height={250}
            alt="A singing bird with notes"
            className="dark:hidden"
          />
          <Image
            src="/empty-dark.svg"
            width={250}
            height={250}
            alt="A singing bird with notes"
            className="hidden dark:block"
          />
          <div className="text-lg text-neutral-600 font-semibold dark:text-neutral-200">
            Nothing to show yet, search something.
          </div>
        </div>
      ) : (
        <Accordion type="single" collapsible>
          {workspace?.questions?.map((questionPair) => (
            <AccordionItem value={questionPair.question}>
              <AccordionTrigger>{questionPair.question}</AccordionTrigger>
              <AccordionContent>{questionPair.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default TopicForm;

"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { model } from "@/utils/gemini-api";
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
import { Workspace } from "@/store/workspace";
import { useUser } from "@clerk/clerk-react";

const TopicForm = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const { workspaceId } = useParams();

  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });

  const saveQuestions = useMutation(api.workspace.saveQuestions);

  const getQuizResponse = async () => {
    const result = await model.generateContent(topic);
    const response = result.response;

    const text = await response.text();
    console.log(text);
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
      <div className="text-xl font-bold">{workspace?.name}</div>
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
      <Accordion type="single" collapsible>
        {workspace?.questions?.map((questionPair) => (
          <AccordionItem value={questionPair.question}>
            <AccordionTrigger>{questionPair.question}</AccordionTrigger>
            <AccordionContent>{questionPair.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TopicForm;

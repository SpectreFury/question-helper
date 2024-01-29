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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Workspace } from "@/store/workspace";

type Question = {
  question: string;
  answer: string;
};

const TopicForm = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionPairs, setQuestionPairs] = useState<Question[]>([]);

  const { workspaceId } = useParams();

  const workspace: Workspace = useQuery(api.workspace.getWorkspace, {
    id: workspaceId as Id<"workspaces">,
  });

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

    setQuestionPairs(
      filteredQuestions.map((filteredQuestion, i) => ({
        question: filteredQuestion,
        answer: filteredAnswers[i],
      }))
    );
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
      {loading ? (
        <ButtonLoading className="self-start" />
      ) : (
        <Button className="self-start" onClick={getResponse}>
          Generate
        </Button>
      )}
      <Accordion type="single" collapsible>
        {questionPairs.map((questionPair) => (
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

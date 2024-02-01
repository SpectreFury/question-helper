import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Quiz } from "@/store/workspace";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useCarouselStore } from "@/store/carousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizItemProps {
  quizItem: Quiz;
  workspaceId: Id<"workspaces">;
  quizLength: number;
}

const QuizItem = ({ quizItem, workspaceId, quizLength }: QuizItemProps) => {
  const saveSelectedAnswer = useMutation(api.workspace.saveSelectedAnswer);
  const { currentItem, setNextItem, setPreviousItem } = useCarouselStore();

  const setSelectedAnswer = async (
    question: string,
    selectedAnswer: string
  ) => {
    try {
      await saveSelectedAnswer({
        workspaceId: workspaceId as Id<"workspaces">,
        question,
        selectedAnswer,
      });
    } catch (error) {
      console.log("setSelectedAnswer error", error);
    }
  };

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>{quizItem.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedAnswer(quizItem.question, e.target.value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={quizItem.choices.a}
                id={quizItem.choices.a}
              />
              <Label htmlFor={quizItem.choices.a}>{quizItem.choices.a}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={quizItem.choices.b}
                id={quizItem.choices.b}
              />
              <Label htmlFor={quizItem.choices.b}>{quizItem.choices.b}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={quizItem.choices.c}
                id={quizItem.choices.c}
              />
              <Label htmlFor={quizItem.choices.c}>{quizItem.choices.c}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={quizItem.choices.d}
                id={quizItem.choices.d}
              />
              <Label htmlFor={quizItem.choices.d}>{quizItem.choices.d}</Label>
            </div>
          </RadioGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <Button
            onClick={() => {
              setPreviousItem(quizLength);
              console.log(quizLength, currentItem);
            }}
          >
            <ArrowLeft />
          </Button>
          <Button
            onClick={() => {
              setNextItem(quizLength);
              console.log(quizLength, currentItem);
            }}
          >
            <ArrowRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizItem;

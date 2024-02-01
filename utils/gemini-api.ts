import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const convertQuizArrayToObjectArray = (quizArray: string[]) => {
  // Create an array to store the objects.
  const objectArray = [];

  // Iterate through the quiz array.
  for (let i = 0; i < quizArray.length; i++) {
    // Get the question and choices.
    const question = quizArray[i];
    const choices: any = {};
    const choicesOption: any = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
    };

    let counter = 0;
    for (let j = i + 1; j < i + 5; j++) {
      const choice = quizArray[j];
      choices[choicesOption[counter]] = choice;
      counter = counter + 1;
    }

    // Get the correct answer.
    const correctAnswer = quizArray[i + 5].slice(9);

    // Create an object with the question, choices, and correct answer.
    const object = {
      question,
      choices,
      correctAnswer,
    };

    // Add the object to the array.
    objectArray.push(object);

    // Skip the next 5 elements (the choices and correct answer).
    i += 5;
  }

  // Return the array of objects.
  return objectArray;
};

export { model, convertQuizArrayToObjectArray };

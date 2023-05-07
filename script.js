const API_URL = "https://opentdb.com/api.php?amount=10";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let lastAnswerStatus = null;

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const resultElement = document.getElementById("result");
const resultElement1 = document.getElementById("result1");

shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const getQuestions = async (amount) => {
  const response = await fetch(`${API_URL}&amount=${amount}`);
  const data = await response.json();
  return data.results;
};

startQuiz = async () => {
  resultElement1.innerHTML = "";
  let amount = 0;
  let validAmount = false;
  while (!validAmount) {
    try {
      amount = parseInt(prompt("How many questions do you want?"));
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid number.");
      } else {
        validAmount = true;
      }
    } catch (error) {
      alert("Please enter a valid number.");
    }
  }

  questions = await getQuestions(amount);
  shuffleArray(questions);
  currentQuestionIndex = 0;
  score = 0;
  startButton.style.display = "none";
  showQuestion();
};

showQuestion = () => {
  console.log("showQuestion");
  const question = questions[currentQuestionIndex];
  questionElement.innerHTML = decodeURIComponent(question.question);
  choicesElement.innerHTML = "";
  const choices = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(choices);
  for (let choice of choices) {
    const li = document.createElement("li");
    li.classList.add("list-group");
    li.innerHTML = decodeURIComponent(choice);
    li.onclick = () => checkAnswer(li, question.correct_answer);
    choicesElement.appendChild(li);
  }
};

checkAnswer = (li, answer) => {
  if (li.innerHTML === decodeURIComponent(answer)) {
    score++;
    lastAnswerStatus = "correct";
    li.classList.add("correct");
  } else {
    lastAnswerStatus = "incorrect";
    li.classList.add("incorrect");
    for (let choice of choicesElement.children) {
      if (choice.innerHTML === decodeURIComponent(answer)) {
        choice.classList.add("correct");
        break;
      }
    }
  }
  for (let choice of choicesElement.children) {
    choice.onclick = null;
  }
  showAnswerStatus();
};

showAnswerStatus = () => {
  if (lastAnswerStatus === "correct") {
    resultElement.innerText = "Correct!";
  } else if (lastAnswerStatus === "incorrect") {
    resultElement.innerText = "Incorrect.";
  } else {
    resultElement.innerText = "";
  }
  nextButton.style.display = "block";
};

const nextButton = document.getElementById("next-button");
nextButton.onclick = () => {
  resultElement.innerHTML = "";
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    showResult();
  } else {
    showQuestion();
  }
};

showResult = () => {
  console.log("showResult");
  document.getElementById("next-button").style.display = "none";
  questionElement.innerText = "";
  choicesElement.innerHTML = "";
  resultElement1.innerText = `Your final score is ${score} of ${questions.length}.`;
  startButton.style.display = "block";
  resultElement.innerHTML = "";
};

const startButton = document.getElementById("start-button");
startButton.onclick = startQuiz;

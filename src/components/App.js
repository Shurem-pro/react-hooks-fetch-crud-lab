import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // GET /questions - Fetch all questions on component mount
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  // POST /questions - Add a new question
  function handleAddQuestion(newQuestionData) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: newQuestionData.prompt,
        answers: [
          newQuestionData.answer1,
          newQuestionData.answer2,
          newQuestionData.answer3,
          newQuestionData.answer4,
        ],
        correctIndex: parseInt(newQuestionData.correctIndex),
      }),
    })
      .then((r) => r.json())
      .then((newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setPage("List"); // Switch to list view after adding
      })
      .catch((error) => console.error("Error adding question:", error));
  }

  // DELETE /questions/:id - Remove a question
  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          setQuestions(questions.filter((question) => question.id !== id));
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  }

  // PATCH /questions/:id - Update correct answer
  function handleUpdateQuestion(id, correctIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: parseInt(correctIndex) }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        setQuestions(
          questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
        );
      })
      .catch((error) => console.error("Error updating question:", error));
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList 
          questions={questions} 
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
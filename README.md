# CppJudge

**CppJudge** is a lightweight online coding platform inspired by LeetCode, designed for practicing **C++ programming problems** directly in the browser.
It provides an integrated code editor, real-time test execution, submission evaluation, and progress tracking.

The project was built to explore **full-stack development using the MERN stack** and to implement a **sandboxed code execution system** for running user-submitted programs securely.

---

## Key Features

### Interactive Code Editor

* Integrated **Monaco Editor** (the same editor used in VS Code)
* Syntax highlighting and bracket matching
* Optimized for C++ development

### Run & Submit Workflow

* **Run:** Execute code against sample test cases
* **Submit:** Evaluate solutions against hidden test cases
* Immediate verdict feedback

### User Authentication

* Secure signup and login
* Password hashing using industry-standard practices
* Token-based authentication

### Progress Tracking

* View solved problems categorized by difficulty
* Track submission history
* Profile statistics

### Problem Library

* 20 curated algorithmic problems
* Difficulty levels: **Easy, Medium, Hard**
* Covers core topics including arrays, dynamic programming, graphs, and strings

### Secure Code Execution

* Isolated execution environment
* Time and memory limits enforced
* Prevents malicious code execution

---

## Problem Set Overview

### Easy

* Hello World
* Sum of Two Numbers
* Reverse a String
* FizzBuzz
* Count Vowels
* Even or Odd
* Factorial

### Medium

* Two Sum
* Palindrome Check
* Maximum Subarray
* Valid Parentheses
* Binary Search
* Count Inversions

### Hard

* Longest Common Subsequence
* 0/1 Knapsack
* Longest Increasing Subsequence
* Word Break
* Number of Islands
* Trapping Rain Water
* Median of Two Sorted Arrays

---

## System Architecture

```
Browser (Client)
│
├── React Application
│   ├── Monaco Editor
│   ├── State Management
│   └── API Requests
│
▼
REST API (Backend)
│
├── Authentication
├── Problem Management
├── Submission Evaluation
└── Profile & Statistics
│
├── Database
│   ├── Users
│   ├── Problems
│   └── Submissions
│
└── Judge Service
    ├── Compile C++ code
    ├── Execute test cases
    └── Return verdict
```

---

## Tech Stack

| Layer             | Technology                           |
| ----------------- | ------------------------------------ |
| Frontend          | React                                |
| Build Tool        | Vite                                 |
| Code Editor       | Monaco Editor                        |
| Styling           | Tailwind CSS                         |
| State Management  | Zustand                              |
| Backend           | Node.js + Express                    |
| Database          | MongoDB                              |
| ORM               | Mongoose                             |
| Authentication    | JWT                                  |
| Password Security | bcrypt                               |
| Judge System      | g++ compiler with isolated execution |
| Deployment        | Cloud hosting platforms              |

---

## Project Structure

```
cppjudge/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── index.js
│
└── frontend/
    ├── components/
    ├── pages/
    ├── store/
    └── utils/
```

---

## Running Locally

### Prerequisites

Install the following tools before running the project:

* Node.js
* MongoDB
* C++ compiler (g++)

### Setup

1. Clone the repository

```
git clone <repository-url>
cd cppjudge
```

2. Install backend dependencies

```
cd backend
npm install
```

3. Install frontend dependencies

```
cd ../frontend
npm install
```

4. Configure environment variables locally.

5. Start development servers

Backend:

```
npm run dev
```

Frontend:

```
npm run dev
```

---

## Security Considerations

User-submitted programs are executed with:

* **Execution time limits**
* **Memory limits**
* **Network access disabled**
* **Filesystem restrictions**

These measures help ensure safe code execution.

---

## Future Improvements

Potential enhancements for the platform:

* Leaderboard system
* Additional programming languages
* Problem discussions
* Code sharing links
* Markdown support for problem descriptions
* Larger problem library

---

## Acknowledgements

This project was developed as a learning initiative to explore:

* Full-stack web development
* Secure code execution systems
* Algorithmic problem platforms


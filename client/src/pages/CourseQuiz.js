import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaClock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight, FaFlag } from 'react-icons/fa';
import './CourseQuiz.css';

const CourseQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock MCQ data - in real app, this would come from API
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuizQuestions();
  }, [courseId]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      submitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const fetchQuizQuestions = async () => {
    try {
      // Mock questions based on course
      const mockQuestions = generateMockQuestions(courseId);
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (courseId) => {
    const courseQuestions = {
      '1': generateCProgrammingQuestions(),
      '2': generateDSAQuestions(),
      '3': generateDBMSQuestions(),
      '4': generateReactQuestions()
    };
    return courseQuestions[courseId] || [];
  };

  const generateCProgrammingQuestions = () => {
    // Generate 50 C programming questions
    const questions = [];
    
    // Questions 1-10: Basic concepts
    questions.push(
      {
        id: 1,
        question: "What is the correct way to declare a pointer in C?",
        options: ["int *ptr;", "int ptr*;", "*int ptr;", "int &ptr;"],
        correct: 0,
        explanation: "In C, pointers are declared using the asterisk (*) symbol before the variable name."
      },
      {
        id: 2,
        question: "Which of the following is not a valid C data type?",
        options: ["int", "float", "string", "char"],
        correct: 2,
        explanation: "C does not have a built-in 'string' data type. Strings are arrays of characters."
      },
      {
        id: 3,
        question: "What is the size of an integer in C?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the system"],
        correct: 3,
        explanation: "The size of an integer in C depends on the system architecture (16-bit, 32-bit, 64-bit)."
      },
      {
        id: 4,
        question: "Which operator is used for address of a variable?",
        options: ["*", "&", "%", "#"],
        correct: 1,
        explanation: "The & operator is used to get the address of a variable in C."
      },
      {
        id: 5,
        question: "What is the size of char data type in C?",
        options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
        correct: 0,
        explanation: "The size of char is always 1 byte in C."
      },
      {
        id: 6,
        question: "Which of the following is a valid variable name in C?",
        options: ["2variable", "_variable", "var-iable", "variable name"],
        correct: 1,
        explanation: "Variable names in C can start with underscore or letter, but not with numbers or special characters."
      },
      {
        id: 7,
        question: "What is the default return type of a function in C?",
        options: ["void", "int", "char", "float"],
        correct: 1,
        explanation: "If no return type is specified, C assumes the function returns an int."
      },
      {
        id: 8,
        question: "Which header file is used for input/output operations?",
        options: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<math.h>"],
        correct: 0,
        explanation: "stdio.h contains declarations for input/output functions like printf and scanf."
      },
      {
        id: 9,
        question: "Which of the following is the correct syntax for a for loop in C?",
        options: ["for (int i = 0; i < 10; i++)", "for (i = 0; i < 10; i++)", "for (int i = 0; i < 10; i++)", "All of the above"],
        correct: 3,
        explanation: "All syntaxes are correct, though the first one is C99 standard."
      },
      {
        id: 10,
        question: "What does the post-increment operator (x++) do?",
        options: ["Increments first, then returns value", "Returns value first, then increments", "Only increments", "Only returns value"],
        correct: 1,
        explanation: "Post-increment operator (x++) returns the value first, then increments."
      }
    );

    // Questions 11-25: Additional C programming concepts
    const additionalQuestions = [
      {
        question: "Which operator has the highest precedence in C?",
        options: ["+", "*", "()", "="],
        correct: 2,
        explanation: "Parentheses () have the highest precedence in C."
      },
      {
        question: "What is the purpose of the sizeof operator?",
        options: ["To get the size of a variable", "To get the address of a variable", "To compare two variables", "To increment a variable"],
        correct: 0,
        explanation: "sizeof operator returns the size in bytes of a variable or data type."
      },
      {
        question: "Which of the following is a logical operator?",
        options: ["&&", "++", "--", "sizeof"],
        correct: 0,
        explanation: "&& is the logical AND operator in C."
      },
      {
        question: "What does the ternary operator (?:) do?",
        options: ["Performs arithmetic operations", "Provides conditional execution", "Declares variables", "Allocates memory"],
        correct: 1,
        explanation: "Ternary operator (?:) provides conditional execution based on a condition."
      },
      {
        question: "Which operator is used for bitwise AND operation?",
        options: ["&&", "&", "||", "|"],
        correct: 1,
        explanation: "& is the bitwise AND operator, while && is logical AND."
      },
      {
        question: "What is the difference between == and = operators?",
        options: ["No difference", "== is assignment, = is comparison", "== is comparison, = is assignment", "Both are comparison"],
        correct: 2,
        explanation: "== is used for comparison, = is used for assignment."
      },
      {
        question: "Which operator is used for address of a variable?",
        options: ["*", "&", "%", "#"],
        correct: 1,
        explanation: "& operator is used to get the address of a variable."
      },
      {
        question: "What does the comma operator (,) do?",
        options: ["Separates function parameters", "Evaluates expressions from left to right", "Creates arrays", "Compares values"],
        correct: 1,
        explanation: "Comma operator evaluates expressions from left to right and returns the rightmost value."
      },
      {
        question: "Which operator is used for pointer dereferencing?",
        options: ["&", "*", "->", "[]"],
        correct: 1,
        explanation: "* operator is used to dereference a pointer and access the value it points to."
      },
      {
        question: "What is the purpose of the arrow operator (->)?",
        options: ["Access structure members through pointer", "Declare pointers", "Compare values", "Allocate memory"],
        correct: 0,
        explanation: "Arrow operator (->) is used to access structure members through a pointer."
      },
      {
        question: "What is the purpose of function prototypes in C?",
        options: ["Define function body", "Declare function before use", "Call functions", "Return values"],
        correct: 1,
        explanation: "Function prototypes declare the function signature before it's defined or used."
      },
      {
        question: "Which of the following is a valid function declaration?",
        options: ["int func();", "int func(void);", "int func(int a, int b);", "All of the above"],
        correct: 3,
        explanation: "All three are valid function declarations in C."
      },
      {
        question: "What is the difference between call by value and call by reference?",
        options: ["No difference", "Call by value copies values, call by reference passes addresses", "Call by reference copies values, call by value passes addresses", "Both pass addresses"],
        correct: 1,
        explanation: "Call by value copies the actual value, call by reference passes the address of the variable."
      },
      {
        question: "Which keyword is used to declare a function that doesn't return a value?",
        options: ["int", "char", "void", "float"],
        correct: 2,
        explanation: "void keyword is used for functions that don't return any value."
      },
      {
        question: "What is the purpose of the return statement in a function?",
        options: ["Start the function", "End the function", "Return a value to caller", "Declare variables"],
        correct: 2,
        explanation: "return statement is used to return a value from a function to its caller."
      }
    ];
    
    for (let i = 11; i <= 25; i++) {
      questions.push({
        id: i,
        question: additionalQuestions[i - 11].question,
        options: additionalQuestions[i - 11].options,
        correct: additionalQuestions[i - 11].correct,
        explanation: additionalQuestions[i - 11].explanation
      });
    }

    return questions;
  };

  const generateDSAQuestions = () => [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1,
      explanation: "Binary search has O(log n) time complexity as it eliminates half of the search space in each iteration."
    },
    {
      id: 2,
      question: "Which data structure follows LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
      explanation: "Stack follows Last In First Out (LIFO) principle where the last element added is the first to be removed."
    },
    {
      id: 3,
      question: "What is the time complexity of insertion in a binary search tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "In a balanced BST, insertion takes O(log n) time as we traverse down the tree to find the correct position."
    },
    {
      id: 4,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
      correct: 2,
      explanation: "Quick Sort has O(n log n) average-case time complexity, which is optimal for comparison-based sorting."
    },
    {
      id: 5,
      question: "What is the space complexity of merge sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 2,
      explanation: "Merge sort requires O(n) extra space for the temporary arrays used during merging."
    },
    {
      id: 6,
      question: "Which data structure is best for implementing a priority queue?",
      options: ["Array", "Linked List", "Heap", "Stack"],
      correct: 2,
      explanation: "Heap is the most efficient data structure for implementing priority queues due to its O(log n) insertion and deletion."
    },
    {
      id: 7,
      question: "What is the time complexity of searching in a hash table?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 0,
      explanation: "Hash table provides O(1) average-case time complexity for search operations."
    },
    {
      id: 8,
      question: "Which traversal visits root, left subtree, then right subtree?",
      options: ["Inorder", "Preorder", "Postorder", "Level order"],
      correct: 1,
      explanation: "Preorder traversal visits the root first, then the left subtree, then the right subtree."
    },
    {
      id: 9,
      question: "What is the maximum number of nodes in a binary tree of height h?",
      options: ["2^h", "2^h - 1", "2^(h+1) - 1", "h^2"],
      correct: 2,
      explanation: "A complete binary tree of height h has at most 2^(h+1) - 1 nodes."
    },
    {
      id: 10,
      question: "Which algorithm is used to find the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra's", "Bubble Sort"],
      correct: 2,
      explanation: "Dijkstra's algorithm is used to find the shortest path from a source vertex to all other vertices in a weighted graph."
    },
    {
      id: 11,
      question: "What is the time complexity of heapify operation?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "Heapify operation takes O(log n) time as it moves an element down the heap tree."
    },
    {
      id: 12,
      question: "Which data structure is used for implementing recursion?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correct: 1,
      explanation: "Stack is used to manage function calls and local variables in recursion."
    },
    {
      id: 13,
      question: "What is the space complexity of recursive binary search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "Recursive binary search uses O(log n) space for the call stack."
    },
    {
      id: 14,
      question: "Which sorting algorithm is stable?",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      correct: 2,
      explanation: "Merge Sort is stable as it maintains the relative order of equal elements."
    },
    {
      id: 15,
      question: "What is the time complexity of finding the minimum element in a min-heap?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 0,
      explanation: "The minimum element in a min-heap is always at the root, so it can be accessed in O(1) time."
    },
    {
      id: 16,
      question: "Which data structure is best for implementing a LRU cache?",
      options: ["Array", "Linked List", "Hash Map + Doubly Linked List", "Stack"],
      correct: 2,
      explanation: "Hash Map provides O(1) access while Doubly Linked List allows O(1) insertion/deletion for LRU operations."
    },
    {
      id: 17,
      question: "What is the time complexity of union operation in Union-Find with path compression?",
      options: ["O(1)", "O(log n)", "O(n)", "Nearly O(1)"],
      correct: 3,
      explanation: "With path compression, Union-Find operations have nearly O(1) amortized time complexity."
    },
    {
      id: 18,
      question: "Which traversal gives sorted order in a BST?",
      options: ["Preorder", "Inorder", "Postorder", "Level order"],
      correct: 1,
      explanation: "Inorder traversal of a BST gives elements in sorted order."
    },
    {
      id: 19,
      question: "What is the time complexity of building a heap from an array?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correct: 0,
      explanation: "Building a heap from an array can be done in O(n) time using bottom-up heap construction."
    },
    {
      id: 20,
      question: "Which algorithm is used to detect cycles in a directed graph?",
      options: ["BFS", "DFS", "Dijkstra's", "Kruskal's"],
      correct: 1,
      explanation: "DFS can be used to detect cycles in a directed graph by tracking visited and recursion stack."
    },
    {
      id: 21,
      question: "What is the space complexity of iterative quick sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "Iterative quick sort uses O(log n) space for the explicit stack to simulate recursion."
    },
    {
      id: 22,
      question: "Which data structure is used in BFS?",
      options: ["Stack", "Queue", "Priority Queue", "Heap"],
      correct: 1,
      explanation: "BFS uses a queue to process nodes level by level."
    },
    {
      id: 23,
      question: "What is the time complexity of finding all pairs shortest path?",
      options: ["O(n²)", "O(n³)", "O(n log n)", "O(n)"],
      correct: 1,
      explanation: "Floyd-Warshall algorithm finds all pairs shortest path in O(n³) time."
    },
    {
      id: 24,
      question: "Which sorting algorithm has O(n) best-case time complexity?",
      options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
      correct: 3,
      explanation: "Insertion Sort has O(n) best-case time complexity when the array is already sorted."
    },
    {
      id: 25,
      question: "What is the time complexity of deleting from a balanced BST?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "Deletion from a balanced BST takes O(log n) time as we need to traverse to find the node and maintain balance."
    }
  ];

  const generateDBMSQuestions = () => [
    {
      id: 1,
      question: "What does ACID stand for in database transactions?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Accuracy, Consistency, Integrity, Durability",
        "Atomicity, Consistency, Integrity, Durability",
        "Accuracy, Consistency, Isolation, Durability"
      ],
      correct: 0,
      explanation: "ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability."
    },
    {
      id: 2,
      question: "Which SQL command is used to retrieve data from a database?",
      options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      correct: 1,
      explanation: "SELECT is used to retrieve data from database tables."
    },
    {
      id: 3,
      question: "What is the primary key in a database table?",
      options: ["A key that can be null", "A key that uniquely identifies each row", "A key that is always numeric", "A key that is always text"],
      correct: 1,
      explanation: "A primary key uniquely identifies each row in a table and cannot be null."
    },
    {
      id: 4,
      question: "Which normal form eliminates partial dependencies?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correct: 1,
      explanation: "Second Normal Form (2NF) eliminates partial dependencies by ensuring all non-key attributes are fully dependent on the primary key."
    },
    {
      id: 5,
      question: "What is the purpose of an index in a database?",
      options: ["To store data", "To improve query performance", "To create relationships", "To validate data"],
      correct: 1,
      explanation: "Indexes improve query performance by providing faster access to data."
    },
    {
      id: 6,
      question: "Which SQL function is used to count rows?",
      options: ["SUM()", "COUNT()", "AVG()", "MAX()"],
      correct: 1,
      explanation: "COUNT() function is used to count the number of rows in a result set."
    },
    {
      id: 7,
      question: "What is a foreign key?",
      options: ["A key that is always unique", "A key that references another table's primary key", "A key that is always numeric", "A key that cannot be null"],
      correct: 1,
      explanation: "A foreign key is a field that references the primary key of another table to establish relationships."
    },
    {
      id: 8,
      question: "Which SQL command is used to modify existing data?",
      options: ["INSERT", "SELECT", "UPDATE", "CREATE"],
      correct: 2,
      explanation: "UPDATE command is used to modify existing data in database tables."
    },
    {
      id: 9,
      question: "What is the purpose of GROUP BY clause?",
      options: ["To sort data", "To filter data", "To group rows with same values", "To join tables"],
      correct: 2,
      explanation: "GROUP BY clause groups rows that have the same values in specified columns."
    },
    {
      id: 10,
      question: "Which constraint ensures a column cannot have null values?",
      options: ["PRIMARY KEY", "UNIQUE", "NOT NULL", "CHECK"],
      correct: 2,
      explanation: "NOT NULL constraint ensures that a column cannot have null values."
    },
    {
      id: 11,
      question: "What is the purpose of HAVING clause?",
      options: ["To filter rows", "To filter groups", "To sort data", "To join tables"],
      correct: 1,
      explanation: "HAVING clause is used to filter groups after GROUP BY, similar to WHERE for rows."
    },
    {
      id: 12,
      question: "Which join returns all rows from both tables?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correct: 3,
      explanation: "FULL OUTER JOIN returns all rows from both tables, matching where possible."
    },
    {
      id: 13,
      question: "What is the purpose of a view in a database?",
      options: ["To store data", "To create a virtual table", "To create indexes", "To validate data"],
      correct: 1,
      explanation: "A view is a virtual table based on the result of a SQL statement, providing a way to look at data."
    },
    {
      id: 14,
      question: "Which SQL command is used to create a new table?",
      options: ["INSERT", "SELECT", "CREATE", "UPDATE"],
      correct: 2,
      explanation: "CREATE command is used to create new database objects like tables."
    },
    {
      id: 15,
      question: "What is the purpose of a transaction in a database?",
      options: ["To store data", "To group related operations", "To create indexes", "To validate data"],
      correct: 1,
      explanation: "A transaction groups related database operations that should be executed as a single unit."
    },
    {
      id: 16,
      question: "Which SQL function is used to find the maximum value?",
      options: ["SUM()", "COUNT()", "MAX()", "AVG()"],
      correct: 2,
      explanation: "MAX() function returns the maximum value in a column."
    },
    {
      id: 17,
      question: "What is the purpose of the DISTINCT keyword?",
      options: ["To sort data", "To filter data", "To remove duplicates", "To join tables"],
      correct: 2,
      explanation: "DISTINCT keyword is used to return only unique values, removing duplicates."
    },
    {
      id: 18,
      question: "Which constraint ensures a column has unique values?",
      options: ["PRIMARY KEY", "UNIQUE", "NOT NULL", "CHECK"],
      correct: 1,
      explanation: "UNIQUE constraint ensures that all values in a column are unique."
    },
    {
      id: 19,
      question: "What is the purpose of the ORDER BY clause?",
      options: ["To filter data", "To group data", "To sort data", "To join tables"],
      correct: 2,
      explanation: "ORDER BY clause is used to sort the result set in ascending or descending order."
    },
    {
      id: 20,
      question: "Which join returns only matching rows from both tables?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correct: 0,
      explanation: "INNER JOIN returns only rows that have matching values in both tables."
    },
    {
      id: 21,
      question: "What is the purpose of a stored procedure?",
      options: ["To store data", "To create a reusable SQL code block", "To create indexes", "To validate data"],
      correct: 1,
      explanation: "A stored procedure is a prepared SQL code that can be saved and reused multiple times."
    },
    {
      id: 22,
      question: "Which SQL command is used to delete data from a table?",
      options: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      correct: 3,
      explanation: "DELETE command is used to remove rows from a database table."
    },
    {
      id: 23,
      question: "What is the purpose of the LIKE operator?",
      options: ["To perform exact matches", "To perform pattern matching", "To perform calculations", "To join tables"],
      correct: 1,
      explanation: "LIKE operator is used for pattern matching in SQL queries using wildcards."
    },
    {
      id: 24,
      question: "Which SQL function is used to calculate the average?",
      options: ["SUM()", "COUNT()", "AVG()", "MAX()"],
      correct: 2,
      explanation: "AVG() function calculates the average value of a numeric column."
    },
    {
      id: 25,
      question: "What is the purpose of a trigger in a database?",
      options: ["To store data", "To automatically execute code on events", "To create indexes", "To validate data"],
      correct: 1,
      explanation: "A trigger is a database object that automatically executes code when certain events occur."
    }
  ];

  const generateReactQuestions = () => [
    {
      id: 1,
      question: "What is the purpose of useEffect hook in React?",
      options: [
        "To manage component state",
        "To perform side effects in functional components",
        "To handle form submissions",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM in functional components."
    },
    {
      id: 2,
      question: "What is JSX in React?",
      options: [
        "A JavaScript extension that allows HTML-like syntax",
        "A new programming language",
        "A CSS framework",
        "A database query language"
      ],
      correct: 0,
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React components."
    },
    {
      id: 3,
      question: "Which hook is used to manage state in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 0,
      explanation: "useState hook is used to add state to functional components in React."
    },
    {
      id: 4,
      question: "What is the purpose of props in React?",
      options: [
        "To store component state",
        "To pass data from parent to child components",
        "To handle events",
        "To create side effects"
      ],
      correct: 1,
      explanation: "Props are used to pass data from parent components to child components in React."
    },
    {
      id: 5,
      question: "Which method is called when a component is first rendered?",
      options: ["componentDidMount", "componentWillMount", "useEffect with empty dependency array", "componentDidUpdate"],
      correct: 2,
      explanation: "useEffect with an empty dependency array runs after the first render, similar to componentDidMount."
    },
    {
      id: 6,
      question: "What is the purpose of keys in React lists?",
      options: [
        "To style list items",
        "To help React identify which items have changed",
        "To sort list items",
        "To filter list items"
      ],
      correct: 1,
      explanation: "Keys help React identify which items have changed, been added, or removed from a list."
    },
    {
      id: 7,
      question: "Which hook is used to access context in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 2,
      explanation: "useContext hook is used to access React context in functional components."
    },
    {
      id: 8,
      question: "What is the purpose of useCallback hook?",
      options: [
        "To manage state",
        "To memoize functions to prevent unnecessary re-renders",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useCallback memoizes functions to prevent unnecessary re-renders of child components."
    },
    {
      id: 9,
      question: "Which lifecycle method is equivalent to useEffect with cleanup?",
      options: ["componentDidMount", "componentWillUnmount", "componentDidUpdate", "componentWillMount"],
      correct: 1,
      explanation: "The cleanup function in useEffect is equivalent to componentWillUnmount in class components."
    },
    {
      id: 10,
      question: "What is the purpose of useMemo hook?",
      options: [
        "To manage state",
        "To memoize values to prevent expensive calculations",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useMemo memoizes the result of expensive calculations to prevent them from running on every render."
    },
    {
      id: 11,
      question: "Which hook is used for complex state management?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 3,
      explanation: "useReducer is used for complex state management, similar to Redux pattern."
    },
    {
      id: 12,
      question: "What is the purpose of React.Fragment?",
      options: [
        "To create a new component",
        "To group multiple elements without adding extra DOM nodes",
        "To handle events",
        "To manage state"
      ],
      correct: 1,
      explanation: "React.Fragment allows you to group multiple elements without adding extra DOM nodes."
    },
    {
      id: 13,
      question: "Which hook is used to create custom hooks?",
      options: ["useState", "useEffect", "useCustom", "Any hook can be used"],
      correct: 3,
      explanation: "Custom hooks are functions that use other hooks, so any hook can be used to create custom hooks."
    },
    {
      id: 14,
      question: "What is the purpose of useRef hook?",
      options: [
        "To manage state",
        "To access DOM elements or store mutable values",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useRef is used to access DOM elements directly or store mutable values that don't cause re-renders."
    },
    {
      id: 15,
      question: "Which method is called when a component updates?",
      options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"],
      correct: 2,
      explanation: "componentDidUpdate is called after a component updates in class components."
    },
    {
      id: 16,
      question: "What is the purpose of React.memo?",
      options: [
        "To manage state",
        "To memoize components to prevent unnecessary re-renders",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "React.memo is a higher-order component that memoizes the result to prevent unnecessary re-renders."
    },
    {
      id: 17,
      question: "Which hook is used to handle form inputs?",
      options: ["useState", "useEffect", "useForm", "useInput"],
      correct: 0,
      explanation: "useState is commonly used to handle form inputs by managing the input values as state."
    },
    {
      id: 18,
      question: "What is the purpose of useLayoutEffect hook?",
      options: [
        "To manage state",
        "To perform side effects synchronously after DOM mutations",
        "To handle form submissions",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useLayoutEffect runs synchronously after all DOM mutations, before the browser paints."
    },
    {
      id: 19,
      question: "Which hook is used to share state between components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 2,
      explanation: "useContext is used to share state between components without prop drilling."
    },
    {
      id: 20,
      question: "What is the purpose of useImperativeHandle hook?",
      options: [
        "To manage state",
        "To customize the instance value exposed to parent components",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useImperativeHandle customizes the instance value that is exposed to parent components when using ref."
    },
    {
      id: 21,
      question: "Which hook is used to handle multiple related state values?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 3,
      explanation: "useReducer is used when you have complex state logic involving multiple sub-values."
    },
    {
      id: 22,
      question: "What is the purpose of useDebugValue hook?",
      options: [
        "To manage state",
        "To display a label for custom hooks in React DevTools",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "useDebugValue is used to display a label for custom hooks in React DevTools."
    },
    {
      id: 23,
      question: "Which hook is used to handle component cleanup?",
      options: ["useState", "useEffect", "useCleanup", "useLayoutEffect"],
      correct: 1,
      explanation: "useEffect can return a cleanup function that runs when the component unmounts or before the effect runs again."
    },
    {
      id: 24,
      question: "What is the purpose of React.lazy?",
      options: [
        "To manage state",
        "To enable code splitting and lazy loading of components",
        "To handle side effects",
        "To create custom hooks"
      ],
      correct: 1,
      explanation: "React.lazy enables code splitting by allowing you to load components only when they are needed."
    },
    {
      id: 25,
      question: "Which hook is used to handle component mounting and unmounting?",
      options: ["useState", "useEffect", "useMount", "useUnmount"],
      correct: 1,
      explanation: "useEffect with an empty dependency array handles mounting, and returning a cleanup function handles unmounting."
    }
  ];


  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    submitQuiz();
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    setScore(percentage);
    setQuizCompleted(true);
    
    // In real app, submit to backend
    console.log('Quiz submitted:', { answers, score: percentage });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="course-quiz animate-fade-in">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const passed = score >= 50;
    return (
      <div className="quiz-results animate-fade-in">
        <div className="results-container card glass-panel">
          <div className={`results-header ${passed ? 'passed' : 'failed'}`}>
            <h1>{passed ? 'Congratulations!' : 'Quiz Failed'}</h1>
            <div className="score-display">
              <span className="score-number">{score}%</span>
              <span className="score-label">Your Score</span>
            </div>
          </div>
          
          <div className="results-details bg-surface border-light rounded p-2 mb-2 flex-column gap-1">
            <div className="result-item flex-row align-center gap-1 font-weight-bold text-primary">
              <FaCheckCircle className="result-icon" />
              <span>Correct Answers: {Object.values(answers).filter((answer, index) => 
                answer === questions[index]?.correct
              ).length} / {questions.length}</span>
            </div>
            <div className="result-item flex-row align-center gap-1 text-secondary">
              <FaTimesCircle className="result-icon" />
              <span>Pass Required: 50%</span>
            </div>
            <div className="result-item flex-row align-center gap-1 text-tertiary">
              <FaFlag className="result-icon" />
              <span>Status: {passed ? 'PASSED' : 'FAILED'}</span>
            </div>
          </div>

          <div className="results-actions flex-row justify-center gap-1">
            <button 
              onClick={() => navigate(`/student/courses`)}
              className="btn btn-primary"
            >
              Back to Courses
            </button>
            <button 
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeLeft(3600);
                setScore(0);
              }}
              className="btn btn-outline"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="course-quiz animate-fade-in">
      <div className="container">
        <div className="quiz-header card glass-panel flex-between mb-3 p-2">
          <div className="quiz-info flex-column">
            <h1 className="mt-0 mb-05 dashboard-title">Course Quiz</h1>
            <p className="text-secondary m-0">Answer all questions to complete the quiz</p>
          </div>
          <div className="quiz-timer flex-row align-center gap-05 bg-warning-50 border border-warning text-warning p-1 rounded">
            <FaClock className="timer-icon" />
            <span className="timer-text font-weight-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="quiz-progress mb-3">
          <div className="progress-bar bg-surface-200 rounded full-width overflow-hidden" style={{ height: '8px' }}>
            <div 
              className="progress-fill bg-primary h-100 transition" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text text-sm text-secondary mt-05 d-block text-right">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="quiz-content card glass-panel p-3">
          <div className="question-card mb-3">
            <div className="question-header flex-row align-center gap-1 mb-2 pb-1 border-bottom">
              <FaQuestionCircle className="question-icon text-primary text-xl" />
              <span className="question-number font-weight-bold text-lg text-primary">Question {currentQuestion + 1}</span>
            </div>
            
            <div className="question-text text-lg mb-3">
              {question?.question}
            </div>

            <div className="options-container flex-column gap-1">
              {question?.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`option-item flex-row align-center gap-1 p-2 rounded border-light bg-surface transition cursor-pointer hover-lift ${answers[question.id] === index ? 'border-primary bg-primary-50' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index}
                    checked={answers[question.id] === index}
                    onChange={() => handleAnswerSelect(question.id, index)}
                    className="accent-primary"
                  />
                  <span className="option-text text-md">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="quiz-navigation flex-between flex-wrap gap-1 mt-3 pt-2 border-top">
            <button 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-outline flex-row align-center gap-05"
            >
              <FaArrowLeft /> Previous
            </button>
            
            <div className="question-indicators flex-row flex-wrap gap-05 justify-center">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`indicator flex-center w-2 h-2 rounded border-light bg-surface text-secondary transition ${index === currentQuestion ? 'bg-primary text-white border-primary' : ''} ${answers[questions[index].id] !== undefined && index !== currentQuestion ? 'bg-success text-white border-success' : ''}`}
                  onClick={() => setCurrentQuestion(index)}
                  style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                className="btn btn-success flex-row align-center gap-05"
              >
                Submit Quiz <FaCheckCircle />
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="btn btn-primary flex-row align-center gap-05"
              >
                Next <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;

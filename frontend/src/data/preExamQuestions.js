export const PRE_EXAM_METADATA = {
  testId: "001-haited-14-nov-26",
  testCode: "001-HAITED",
  date: "14-Nov-26",
  title: "I REMEMBER TEST",
  subtitle: "Pre-exams Recommended by the Center (14-Nov-26)",
  totalMarks: 80,
  totalQuestions: 37,
  sections: [
    { id: 1, name: "Section 1 — Backend Development", range: "Q1 – Q20", count: 20 },
    { id: 2, name: "Section 2 — Python Programming", range: "Q21 – Q37", count: 17 }
  ]
};

export const PRE_EXAM_QUESTIONS = [
  // --- Section 1: Backend Development (Q1-Q20) ---
  {
    id: 1,
    qNum: 1,
    section: "Section 1 — Backend Development",
    question: "What is the recommended approach when choosing your first backend programming language?",
    options: {
      A: "Learn three languages simultaneously",
      B: "Pick one language and master it deeply",
      C: "Change languages every month",
      D: "Learn only frontend languages"
    },
    correctAnswer: "B",
    marks: 3,
    explanation: "Focusing on one language helps build strong programming fundamentals.",
    hint: "Think about depth rather than breadth.",
    aiDeepReview: "When starting with backend development, cognitive overload is the biggest obstacle. Mastering a single language (like Python, JavaScript/Node.js, or Java) allows you to internalize core programming paradigms, control flow, data structures, and backend concepts like HTTP, REST APIs, databases, and authentication. Once you understand these underlying concepts in one language, switching to another language is mostly just learning new syntax."
  },
  {
    id: 2,
    qNum: 2,
    section: "Section 1 — Backend Development",
    question: "Which HTTP method is commonly used to retrieve data from a server?",
    options: {
      A: "POST",
      B: "PUT",
      C: "GET",
      D: "DELETE"
    },
    correctAnswer: "C",
    marks: 3,
    explanation: "GET requests retrieve information from a server.",
    hint: "It is used when you want to fetch information.",
    aiDeepReview: "HTTP GET is defined by RFC 7231 as an idempotent and 'safe' method. This means calling a GET endpoint should only retrieve a representation of the specified resource and must not produce any side effects or alter server state. Browsers use GET requests when you visit URLs or download assets."
  },
  {
    id: 3,
    qNum: 3,
    section: "Section 1 — Backend Development",
    question: "Which HTTP method is commonly used to send new data to a server?",
    options: {
      A: "GET",
      B: "POST",
      C: "DELETE",
      D: "HEAD"
    },
    correctAnswer: "B",
    marks: 3,
    explanation: "POST sends data to the server, often to create a new resource.",
    hint: "Think about submitting a registration form.",
    aiDeepReview: "HTTP POST is designed to submit an entity payload (such as JSON or form data) to the designated resource, typically resulting in a change in state or the creation of a new subordinate resource in the database (returning a 201 Created status code)."
  },
  {
    id: 4,
    qNum: 4,
    section: "Section 1 — Backend Development",
    question: "Which HTTP method is commonly used to replace or update an existing resource?",
    options: {
      A: "GET",
      B: "POST",
      C: "PUT",
      D: "DELETE"
    },
    correctAnswer: "C",
    marks: 3,
    explanation: "PUT is commonly used to update or replace a resource.",
    hint: "It is one of the four basic HTTP methods.",
    aiDeepReview: "HTTP PUT is idempotent: making the same PUT request multiple times will produce the exact same outcome on the server. It replaces the current representation of the target resource with the new request payload. (Note: PATCH is used for partial updates, while PUT is for full replacement)."
  },
  {
    id: 5,
    qNum: 5,
    section: "Section 1 — Backend Development",
    question: "What is the purpose of the DELETE HTTP method?",
    options: {
      A: "Retrieve information",
      B: "Create a new resource",
      C: "Remove a resource",
      D: "Display a webpage"
    },
    correctAnswer: "C",
    marks: 3,
    explanation: "DELETE requests the removal of a specified resource.",
    hint: "Its name gives away its purpose.",
    aiDeepReview: "The HTTP DELETE method instructs the web server to delete the resource identified by the URI. Like PUT and GET, successful DELETE operations are idempotent because repeated requests to delete the same resource will result in the resource remaining deleted (returning 204 No Content or 404 Not Found)."
  },
  {
    id: 6,
    qNum: 6,
    section: "Section 1 — Backend Development",
    question: "What does an HTTP status code in the 200 range generally indicate?",
    options: {
      A: "Server failure",
      B: "Successful request",
      C: "Unauthorized access",
      D: "Missing resource"
    },
    correctAnswer: "B",
    marks: 3,
    explanation: "2xx status codes indicate successful processing.",
    hint: "A common example is status code 200.",
    aiDeepReview: "The 2xx class of status codes indicates that the client's request was successfully received, understood, and accepted. Key examples include 200 OK (standard success), 201 Created (new resource created), and 204 No Content (action succeeded with no content returned)."
  },
  {
    id: 7,
    qNum: 7,
    section: "Section 1 — Backend Development",
    question: "What does HTTP status code 404 mean?",
    options: {
      A: "Request successful",
      B: "Server unavailable",
      C: "Resource not found",
      D: "Access permitted"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "A 404 response indicates that the requested resource could not be found.",
    hint: "You often see this on missing webpages.",
    aiDeepReview: "Status code 404 (Not Found) belongs to the 4xx client-error category. It indicates that the server can communicate with the client, but either the specified URL route does not exist or the specific item being requested (e.g., an ID in the database) was not found."
  },
  {
    id: 8,
    qNum: 8,
    section: "Section 1 — Backend Development",
    question: "What does an HTTP status code in the 500 range indicate?",
    options: {
      A: "Client-side success",
      B: "Server-side error",
      C: "Successful login",
      D: "Resource creation"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "5xx status codes indicate that the server failed to fulfil a valid request.",
    hint: "Something went wrong on the server's end.",
    aiDeepReview: "HTTP 5xx status codes signify server-side errors where the client made a valid request, but the server encountered an unexpected condition, uncaught exception, or timeout. Examples: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, and 504 Gateway Timeout."
  },
  {
    id: 9,
    qNum: 9,
    section: "Section 1 — Backend Development",
    question: "Which framework is commonly associated with Python and known for its high performance?",
    options: {
      A: "Spring Boot",
      B: "FastAPI",
      C: "Express",
      D: "Laravel"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "FastAPI is a modern Python framework for building APIs.",
    hint: "It belongs to the Python ecosystem.",
    aiDeepReview: "FastAPI is built on Starlette and Pydantic, utilizing modern Python type hints and asynchronous (async/await) primitives. It is benchmarked on par with NodeJS and Go frameworks, while providing automatic Swagger/OpenAPI documentation."
  },
  {
    id: 10,
    qNum: 10,
    section: "Section 1 — Backend Development",
    question: "Which framework is commonly used for Java enterprise applications?",
    options: {
      A: "Django",
      B: "Express",
      C: "Spring Boot",
      D: "Flask"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "Spring Boot is widely used for building Java applications.",
    hint: "It is the Java framework highlighted in your material.",
    aiDeepReview: "Spring Boot simplifies the enterprise Java ecosystem by offering opinionated auto-configuration, dependency injection, and embedded web servers (like Tomcat). It is widely favored by large institutions and banks for microservices and mission-critical backends."
  },
  {
    id: 11,
    qNum: 11,
    section: "Section 1 — Backend Development",
    question: "Which framework is associated with Node.js?",
    options: {
      A: "Express",
      B: "Django",
      C: "Spring Boot",
      D: "FastAPI"
    },
    correctAnswer: "A",
    marks: 2,
    explanation: "Express is a web framework commonly used with Node.js.",
    hint: "Think about JavaScript backend development.",
    aiDeepReview: "Express.js is a minimal, unopinionated, and flexible Node.js web application framework providing a robust set of middleware routing features. It forms the backbone of the MERN/MEAN technology stacks."
  },
  {
    id: 12,
    qNum: 12,
    section: "Section 1 — Backend Development",
    question: "Which framework is commonly used for Python web development?",
    options: {
      A: "Spring Boot",
      B: "Django",
      C: "Express",
      D: "React Native"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Django is a Python web framework with many built-in features.",
    hint: "It is known as a batteries-included framework.",
    aiDeepReview: "Django is known as the 'batteries-included' Python web framework. It comes with built-in ORM, admin dashboard, user authentication, CSRF security protections, and database migrations out of the box."
  },
  {
    id: 13,
    qNum: 13,
    section: "Section 1 — Backend Development",
    question: "Which of the following is a relational SQL database?",
    options: {
      A: "MongoDB",
      B: "PostgreSQL",
      C: "Redis",
      D: "Cassandra"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "PostgreSQL is a relational database management system.",
    hint: "It uses structured tables and SQL.",
    aiDeepReview: "PostgreSQL is a powerful, open-source object-relational database system (RDBMS) that emphasizes ACID compliance, extensibility, and complex SQL joins across structured tables."
  },
  {
    id: 14,
    qNum: 14,
    section: "Section 1 — Backend Development",
    question: "Which of the following is a NoSQL document database?",
    options: {
      A: "PostgreSQL",
      B: "MySQL",
      C: "MongoDB",
      D: "SQLite"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "MongoDB stores information in flexible document-based structures.",
    hint: "Think about JSON-like documents.",
    aiDeepReview: "MongoDB is a leading NoSQL database that stores data in flexible, schema-free BSON (Binary JSON) documents. It excels in horizontal scaling, rapid prototyping, and handling deeply nested hierarchical data."
  },
  {
    id: 15,
    qNum: 15,
    section: "Section 1 — Backend Development",
    question: "What is authentication?",
    options: {
      A: "Checking what a user can access",
      B: "Verifying who a user is",
      C: "Deleting user information",
      D: "Creating database tables"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Authentication confirms a user's identity.",
    hint: "It answers, 'Who are you?'",
    aiDeepReview: "Authentication (AuthN) is the security process of verifying the identity of a person or service (e.g., via username/password, biometric scan, or JWT token). It answers the fundamental question: 'Who are you?'"
  },
  {
    id: 16,
    qNum: 16,
    section: "Section 1 — Backend Development",
    question: "What is authorization?",
    options: {
      A: "Verifying a user's identity",
      B: "Checking a user's permissions",
      C: "Creating a password",
      D: "Connecting to the internet"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Authorization determines what an authenticated user is allowed to do.",
    hint: "It answers, 'What can you do?'",
    aiDeepReview: "Authorization (AuthZ) occurs after authentication. It checks role-based access control (RBAC) or access control lists (ACL) to determine if the identified user has permission to read, edit, delete, or perform actions on a specific resource. It answers: 'What permissions do you have?'"
  },
  {
    id: 17,
    qNum: 17,
    section: "Section 1 — Backend Development",
    question: "Where should sensitive values such as API keys and passwords be stored?",
    options: {
      A: "Public source code",
      B: "Public GitHub repositories",
      C: "Environment variables",
      D: "HTML comments"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "Environment variables help keep sensitive configuration out of source code.",
    hint: "Keep secrets separate from your code.",
    aiDeepReview: "According to the 12-Factor App methodology, configuration that changes between environments or contains sensitive secrets (API keys, database credentials) should always be injected via environment variables (e.g., using .env files kept out of version control via .gitignore)."
  },
  {
    id: 18,
    qNum: 18,
    section: "Section 1 — Backend Development",
    question: "What is the primary purpose of an API?",
    options: {
      A: "Design computer hardware",
      B: "Allow software systems to communicate",
      C: "Increase screen brightness",
      D: "Format documents"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "APIs provide defined ways for different software systems to exchange information.",
    hint: "Think about communication between applications.",
    aiDeepReview: "An Application Programming Interface (API) is a set of defined rules, protocols, and endpoints that allow distinct software programs to interact, exchange structured data (like JSON or XML), and trigger functionality without knowing each other's internal implementation details."
  },
  {
    id: 19,
    qNum: 19,
    section: "Section 1 — Backend Development",
    question: "What does CRUD stand for in backend development?",
    options: {
      A: "Create, Read, Update, Delete",
      B: "Copy, Remove, Upload, Download",
      C: "Create, Run, Use, Deploy",
      D: "Connect, Read, Use, Design"
    },
    correctAnswer: "A",
    marks: 2,
    explanation: "CRUD represents the four basic operations used to manage data.",
    hint: "These are common database operations.",
    aiDeepReview: "CRUD maps directly to the standard HTTP methods and database actions: Create (POST / INSERT), Read (GET / SELECT), Update (PUT/PATCH / UPDATE), and Delete (DELETE / DELETE)."
  },
  {
    id: 20,
    qNum: 20,
    section: "Section 1 — Backend Development",
    question: "What is the main purpose of a backend server?",
    options: {
      A: "Only display colours and fonts",
      B: "Handle application logic and data processing",
      C: "Only play videos",
      D: "Control the keyboard"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Backend systems process requests, manage data, and support application functionality.",
    hint: "It works behind the user interface.",
    aiDeepReview: "While the frontend manages presentation and client interaction, the backend server executes business rules, validates inputs, interfaces with databases, securely handles payments and authentication, and orchestrates external services."
  },

  // --- Section 2: Python Programming (Q21-Q37) ---
  {
    id: 21,
    qNum: 21,
    section: "Section 2 — Python Programming",
    question: "Which option should you select during Python installation on Windows to run Python from the command line?",
    options: {
      A: "Disable PATH",
      B: "Add Python to PATH",
      C: "Remove environment variables",
      D: "Disable the installer"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Adding Python to PATH allows it to be launched from the command line.",
    hint: "Look for the checkbox in the installer.",
    aiDeepReview: "The PATH environment variable tells the operating system where to look for executable binaries. Checking 'Add Python to PATH' during installation ensures that typing 'python' or 'pip' in Command Prompt or PowerShell executes the Python interpreter directly from any directory."
  },
  {
    id: 22,
    qNum: 22,
    section: "Section 2 — Python Programming",
    question: "Which built-in Python function displays output?",
    options: {
      A: "input()",
      B: "print()",
      C: "output()",
      D: "show()"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "print() displays text and values in the terminal.",
    hint: "It is one of the first functions beginners learn.",
    aiDeepReview: "The print() function outputs the specified message or variables to the standard output device (console). It supports separator formatting (sep=' '), custom line endings (end='\\n'), and writing to files."
  },
  {
    id: 23,
    qNum: 23,
    section: "Section 2 — Python Programming",
    question: "What type of value does Python's input() function return by default?",
    options: {
      A: "Integer",
      B: "Float",
      C: "String",
      D: "Boolean"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "input() returns entered data as a string, even if the user types digits.",
    hint: "Numeric conversion requires int() or float().",
    aiDeepReview: "Python's input() reads a line from input and returns it strictly as a string (str). Even if a user enters numbers like '42', input() returns the string '42'. To perform arithmetic, it must be explicitly cast using int() or float()."
  },
  {
    id: 24,
    qNum: 24,
    section: "Section 2 — Python Programming",
    question: "Which function converts a string into an integer?",
    options: {
      A: "str()",
      B: "int()",
      C: "float()",
      D: "bool()"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "int() converts suitable values into integers.",
    hint: "Its name is short for integer.",
    aiDeepReview: "The int() built-in constructor converts a number or string containing numeric characters into an integer. For example: int('15') returns 15. If the string contains non-numeric characters (like int('abc')), Python raises a ValueError."
  },
  {
    id: 25,
    qNum: 25,
    section: "Section 2 — Python Programming",
    question: "Which operator performs floor division in Python?",
    options: {
      A: "/",
      B: "%",
      C: "//",
      D: "**"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "The // operator performs floor division.",
    hint: "It uses two forward slashes.",
    aiDeepReview: "Floor division (//) divides two numbers and rounds down to the nearest integer below the quotient. For example, 7 // 2 evaluates to 3, whereas 7 / 2 evaluates to 3.5 (standard float division)."
  },
  {
    id: 26,
    qNum: 26,
    section: "Section 2 — Python Programming",
    question: "Which operator returns the remainder of a division?",
    options: {
      A: "+",
      B: "%",
      C: "//",
      D: "**"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "The modulus operator returns the remainder.",
    hint: "Try calculating 10 % 3.",
    aiDeepReview: "The modulus operator (%) calculates the remainder after integer division. For example, 10 % 3 equals 1 because 3 goes into 10 three times with 1 left over. It is frequently used to test for even/odd numbers (x % 2 == 0)."
  },
  {
    id: 27,
    qNum: 27,
    section: "Section 2 — Python Programming",
    question: "Which operator is used for exponentiation in Python?",
    options: {
      A: "//",
      B: "%%",
      C: "**",
      D: "^^"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "The double-asterisk operator raises a number to a power.",
    hint: "It is used for powers such as 2 raised to 3.",
    aiDeepReview: "In Python, the double asterisk (**) is the exponentiation operator. For example, 2 ** 3 equals 8 (2 * 2 * 2). Note: The caret symbol (^) in Python is used for bitwise XOR, not exponentiation!"
  },
  {
    id: 28,
    qNum: 28,
    section: "Section 2 — Python Programming",
    question: "How does Python define blocks of code?",
    options: {
      A: "Curly braces",
      B: "Indentation",
      C: "Semicolons",
      D: "Square brackets"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Python uses indentation to define code blocks.",
    hint: "Check the spaces before statements inside an if block.",
    aiDeepReview: "Unlike C, Java, or JavaScript which use curly braces {}, Python uses whitespace indentation (PEP 8 recommends 4 spaces per indentation level) to delineate functional blocks of code like functions, loops, and conditional statements."
  },
  {
    id: 29,
    qNum: 29,
    section: "Section 2 — Python Programming",
    question: "Which keyword is used to make a decision in Python?",
    options: {
      A: "repeat",
      B: "if",
      C: "define",
      D: "print"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "The if statement executes code when a condition is true.",
    hint: "It is used in conditional statements.",
    aiDeepReview: "The 'if' keyword starts a conditional statement in Python. If the boolean expression evaluates to True, the indented block of statements under the if clause is executed; otherwise, it is skipped."
  },
  {
    id: 30,
    qNum: 30,
    section: "Section 2 — Python Programming",
    question: "Which keyword provides an alternative when an if condition is false?",
    options: {
      A: "else",
      B: "import",
      C: "return",
      D: "break"
    },
    correctAnswer: "A",
    marks: 2,
    explanation: "else provides an alternative execution path.",
    hint: "It commonly follows an if statement.",
    aiDeepReview: "The 'else' keyword acts as a fallback branch in conditional logic. When the preceding 'if' (and any intermediate 'elif') conditions evaluate to False, the code block inside the 'else' block will execute."
  },
  {
    id: 31,
    qNum: 31,
    section: "Section 2 — Python Programming",
    question: "Which loop is commonly used to iterate through a sequence in Python?",
    options: {
      A: "for",
      B: "switch",
      C: "case",
      D: "goto"
    },
    correctAnswer: "A",
    marks: 2,
    explanation: "A for loop iterates over items in an iterable.",
    hint: "It is commonly used with lists and range().",
    aiDeepReview: "Python's 'for' loop functions as a 'for-each' iterator that traverses through any iterable sequence such as lists, strings, dictionaries, tuples, or range objects, executing the loop body once per element."
  },
  {
    id: 32,
    qNum: 32,
    section: "Section 2 — Python Programming",
    question: "What does range(5) represent when used in a Python loop?",
    options: {
      A: "Numbers 1 to 5",
      B: "Numbers 0 to 4",
      C: "Numbers 0 to 5",
      D: "Five random numbers"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "range(5) starts at zero and stops before five.",
    hint: "The stopping value is excluded.",
    aiDeepReview: "The range() function in Python generates an immutable sequence of integers. When called with a single argument range(stop), it defaults to starting at 0 with step 1 and stops one number before stop. Thus, range(5) produces sequence: 0, 1, 2, 3, 4 (a total of 5 numbers)."
  },
  {
    id: 33,
    qNum: 33,
    section: "Section 2 — Python Programming",
    question: "Which brackets are used to create a Python list?",
    options: {
      A: "()",
      B: "{}",
      C: "[]",
      D: "<>"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "Lists are created using square brackets.",
    hint: "Example: [10, 20, 30].",
    aiDeepReview: "In Python, square brackets [] are literal syntax for creating ordered, mutable sequences called lists (e.g. fruits = ['apple', 'banana', 'cherry']). They allow duplicate elements and dynamic resizing."
  },
  {
    id: 34,
    qNum: 34,
    section: "Section 2 — Python Programming",
    question: "Which brackets are commonly used to create a Python tuple?",
    options: {
      A: "[]",
      B: "()",
      C: "{}",
      D: "<>"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "Tuples are commonly written using parentheses.",
    hint: "Example: (10, 20, 30).",
    aiDeepReview: "Tuples in Python are defined using round parentheses () (e.g. coordinates = (10, 20)). While commas actually define a tuple in Python, parentheses are standard conventions to avoid syntactic ambiguity."
  },
  {
    id: 35,
    qNum: 35,
    section: "Section 2 — Python Programming",
    question: "What is the main difference between a list and a tuple?",
    options: {
      A: "Lists are immutable",
      B: "Tuples are mutable",
      C: "Lists are mutable and tuples are immutable",
      D: "Both are always immutable"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "Lists can be modified, whereas tuples cannot be changed after creation.",
    hint: "Think about whether items can be changed.",
    aiDeepReview: "Lists are mutable (their items can be added, modified, or removed with methods like append() or pop()). Tuples are immutable; once created, their elements cannot be changed or reassigned. Because tuples are immutable, they are faster and can be used as dictionary keys."
  },
  {
    id: 36,
    qNum: 36,
    section: "Section 2 — Python Programming",
    question: "Which method adds an item to the end of a list?",
    options: {
      A: "remove()",
      B: "append()",
      C: "clear()",
      D: "popitem()"
    },
    correctAnswer: "B",
    marks: 2,
    explanation: "append() adds an item to the end of a list.",
    hint: "It is commonly used to add another list element.",
    aiDeepReview: "The list.append(element) method takes a single item and appends it directly to the end of an existing list in-place, increasing the list length by 1 without returning a new list."
  },
  {
    id: 37,
    qNum: 37,
    section: "Section 2 — Python Programming",
    question: "Which Python data type stores key-value pairs?",
    options: {
      A: "List",
      B: "Tuple",
      C: "Dictionary",
      D: "String"
    },
    correctAnswer: "C",
    marks: 2,
    explanation: "Dictionaries store data as key-value pairs.",
    hint: "Example: {'name': 'John', 'age': 25}.",
    aiDeepReview: "A dictionary (dict) in Python stores associative collections of key-value pairs defined by curly braces {} (e.g. {'name': 'Alice', 'role': 'Engineer'}). Keys must be immutable and hashable, allowing O(1) average time complexity for lookups."
  }
];

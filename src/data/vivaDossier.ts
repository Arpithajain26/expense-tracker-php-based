/**
 * Complete College Viva Voce Dossier and Project Report Data
 */

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
  category: 'PHP' | 'MySQL' | 'Security' | 'Architecture' | 'Frontend';
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: "What is the primary objective of this Personal Expense Tracker project?",
    answer: "The objective is to provide a secure web-based financial ledger where users can log daily earnings and expenditures, categorize transactions, analyze monthly cash flow via Chart.js visualizations, and generate downloadable CSV reports.",
    category: "Architecture"
  },
  {
    id: 2,
    question: "Why did you use Core PHP instead of a framework like Laravel?",
    answer: "Core PHP was chosen to demonstrate foundational web development concepts required for a college mini project—including manual session management, custom authentication, PDO prepared statements, and modular file organization—without abstract framework magic.",
    category: "PHP"
  },
  {
    id: 3,
    question: "What is PDO and why is it preferred over mysqli?",
    answer: "PHP Data Objects (PDO) is a database abstraction layer that provides a unified interface across multiple database engines. It supports named placeholders, object-oriented exception handling, and robust prepared statements that prevent SQL Injection.",
    category: "PHP"
  },
  {
    id: 4,
    question: "How does your project prevent SQL Injection attacks?",
    answer: "Every single query receiving user input strictly uses PDO prepared statements with parameterized placeholders (e.g., :email, :user_id, :amount). Because parameters are transmitted separately from the pre-compiled SQL statement, user input cannot alter query syntax.",
    category: "Security"
  },
  {
    id: 5,
    question: "How are passwords stored and verified securely in the database?",
    answer: "Passwords are never stored in plaintext. They are hashed using PHP's native password_hash($password, PASSWORD_BCRYPT), which applies the salted Blowfish algorithm with automatic cost factors. Verification is performed using constant-time password_verify().",
    category: "Security"
  },
  {
    id: 6,
    question: "What is Cross-Site Request Forgery (CSRF) and how did you prevent it?",
    answer: "CSRF tricks an authenticated user into executing unwanted actions. We implemented an anti-CSRF token system: a 32-byte cryptographic token is generated via random_bytes(32) and stored in $_SESSION['csrf_token']. All POST forms transmit this token, verified via hash_equals().",
    category: "Security"
  },
  {
    id: 7,
    question: "What is Cross-Site Scripting (XSS) and how does your app defend against it?",
    answer: "XSS occurs when malicious JavaScript code is injected into the web page. We neutralize this by wrapping all dynamic user output in htmlspecialchars($data, ENT_QUOTES, 'UTF-8'), turning characters like < and > into harmless HTML entities (&lt; &gt;).",
    category: "Security"
  },
  {
    id: 8,
    question: "Why did you choose DECIMAL(10,2) for currency amounts instead of FLOAT?",
    answer: "FLOAT and DOUBLE use IEEE binary floating-point representation, which introduces rounding inaccuracies in arithmetic. DECIMAL is an exact fixed-point numerical format that preserves precise fractional currency values.",
    category: "MySQL"
  },
  {
    id: 9,
    question: "How does the application ensure multi-tenant user data privacy?",
    answer: "Every database query reading, updating, or deleting transactions includes a mandatory WHERE user_id = :user_id clause using the verified ID from the authenticated session ($_SESSION['user_id']). Users cannot access another user's records by tampering with the URL or form inputs.",
    category: "Security"
  },
  {
    id: 10,
    question: "Explain the foreign keys and cascade rules in your database schema.",
    answer: "In the transactions table, user_id references users(id) ON DELETE CASCADE so if a user deletes their profile, all their transactions are cleaned up. category_id references categories(id) ON DELETE RESTRICT to avoid orphaned transactions.",
    category: "MySQL"
  },
  {
    id: 11,
    question: "What is the PRG (Post/Redirect/Get) design pattern and where did you use it?",
    answer: "PRG separates form submission from display. When a user submits a POST form (e.g., save transaction), the action script validates and stores data, then issues an HTTP redirect (header('Location: ...')) to transactions.php. This prevents duplicate submissions if the user refreshes the page.",
    category: "Architecture"
  },
  {
    id: 12,
    question: "How do flash feedback messages work in this application?",
    answer: "Flash messages are temporary status notices stored in $_SESSION['flash']. When the next page loads, includes/header.php renders the Bootstrap alert and immediately unsets the session variable so it appears only once.",
    category: "PHP"
  },
  {
    id: 13,
    question: "How does the category structure handle both global and custom categories?",
    answer: "In the categories table, global categories have user_id = NULL (accessible by all users). When a user creates a custom category, their user_id is assigned. The query uses (user_id IS NULL OR user_id = :user_id) to combine both.",
    category: "MySQL"
  },
  {
    id: 14,
    question: "How are the interactive charts rendered on the dashboard?",
    answer: "PHP aggregates transaction sums grouped by month or category using SQL SUM() and GROUP BY, converts the results into JSON via json_encode(), and Chart.js draws HTML5 Canvas bar and doughnut charts dynamically on the client side.",
    category: "Frontend"
  },
  {
    id: 15,
    question: "Why is session_regenerate_id(true) called upon successful login?",
    answer: "It creates a brand new session identifier and deletes the old one. This protects against Session Fixation attacks, where an attacker tricks a victim into authenticating with a pre-set session ID known to the attacker.",
    category: "Security"
  },
  {
    id: 16,
    question: "What does the CSV Export feature do and how is it formatted?",
    answer: "It queries user-filtered transactions and streams the content with Content-Type: text/csv and Content-Disposition: attachment. We prepend the UTF-8 Byte Order Mark (BOM: \\xEF\\xBB\\xBF) so Microsoft Excel opens special characters and commas correctly.",
    category: "PHP"
  },
  {
    id: 17,
    question: "What is the role of XAMPP in running this application locally?",
    answer: "XAMPP is an open-source local server stack containing Apache (HTTP Web Server), MariaDB/MySQL (Relational Database Server), and PHP (Backend Runtime). It allows full offline development and testing on Windows.",
    category: "Architecture"
  },
  {
    id: 18,
    question: "What happens if a user inputs a negative or zero transaction amount?",
    answer: "Both client-side HTML5 validation (min='0.01') and server-side validation ($amount <= 0 in save-transaction.php) check the input. If violated, an error flash message is triggered, ensuring invalid financial records never touch the database.",
    category: "Security"
  },
  {
    id: 19,
    question: "How does Bootstrap 5 improve the user interface?",
    answer: "Bootstrap 5 provides a mobile-responsive flexbox grid, clean typographic styling, modern utility classes, and accessible form controls. It does not require jQuery, resulting in faster load times and cleaner vanilla JavaScript.",
    category: "Frontend"
  },
  {
    id: 20,
    question: "What is the difference between GET and POST HTTP methods?",
    answer: "GET parameters are appended to the URL query string, have length limits, and are cached by browsers (ideal for filters and searches). POST transmits parameters in the HTTP request body without exposing them in URLs, making it suitable for secure state-changing actions.",
    category: "Architecture"
  },
  {
    id: 21,
    question: "What database indexes were created and why?",
    answer: "Indexes were created on transaction_date, user_id, and category_id. These speed up monthly aggregations, date-range filters, and user lookups from O(N) linear scans to fast O(log N) index seeks.",
    category: "MySQL"
  },
  {
    id: 22,
    question: "How did you implement the mobile navigation sidebar toggle?",
    answer: "The sidebar has a responsive CSS media query that hides it off-canvas on screens smaller than 768px. A button with id='sidebarToggle' uses vanilla JavaScript to toggle the .toggled class, smoothly sliding the menu into view.",
    category: "Frontend"
  },
  {
    id: 23,
    question: "What is hash_equals() and why not use == or === to compare CSRF tokens?",
    answer: "Standard equality operators (== or ===) terminate as soon as a mismatched character is found, creating microscopic timing differences that attackers can measure (timing attack). hash_equals() always executes in constant time regardless of where differences occur.",
    category: "Security"
  },
  {
    id: 24,
    question: "What are future enhancements that can be added to this system?",
    answer: "Future extensions include recurring expense automation, budget limit alerts with email notifications via PHPMailer, receipt image upload with OCR text recognition, and multi-currency exchange conversion.",
    category: "Architecture"
  },
  {
    id: 25,
    question: "How do you explain the database connection code in config/database.php?",
    answer: "It uses a singleton pattern inside getDBConnection() storing a static $pdo instance. It configures PDO::ATTR_ERRMODE to throw exceptions on database errors and disables emulation of prepared statements (PDO::ATTR_EMULATE_PREPARES => false) for native security.",
    category: "PHP"
  }
];

export const TEST_CASES = [
  { id: 'TC-01', module: 'Authentication', description: 'Register with valid credentials', input: 'Name, new email, 8-char password', expected: 'Account created, session established, redirected to dashboard', status: 'PASS' },
  { id: 'TC-02', module: 'Authentication', description: 'Register with duplicate email address', input: 'Existing email address', expected: 'Error: "This email address is already registered"', status: 'PASS' },
  { id: 'TC-03', module: 'Authentication', description: 'Login with incorrect password', input: 'Valid email, wrong password', expected: 'Error: "Invalid email address or password"', status: 'PASS' },
  { id: 'TC-04', module: 'Transactions', description: 'Add income transaction', input: 'Type: Income, Category: Salary, Amount: $3500', expected: 'Record saved in DB, monthly income metric increases by $3500', status: 'PASS' },
  { id: 'TC-05', module: 'Transactions', description: 'Add expense with zero/negative amount', input: 'Amount: -50.00', expected: 'Form rejected with error: "Please enter a valid amount greater than zero"', status: 'PASS' },
  { id: 'TC-06', module: 'Transactions', description: 'Edit existing transaction amount', input: 'Change amount from $40 to $65', expected: 'Database updated, updated total reflected in dashboard', status: 'PASS' },
  { id: 'TC-07', module: 'Transactions', description: 'Delete transaction with confirmation', input: 'Click delete, confirm OK', expected: 'Transaction removed from MySQL, success message shown', status: 'PASS' },
  { id: 'TC-08', module: 'Security', description: 'Direct URL access to another user\'s record', input: 'GET /edit-transaction.php?id=99 (owned by other)', expected: 'Denied: "Transaction not found or you do not have permission"', status: 'PASS' },
  { id: 'TC-09', module: 'Security', description: 'Unauthenticated user accesses dashboard', input: 'Visit /dashboard.php with no session', expected: 'Redirected to login.php with warning notice', status: 'PASS' },
  { id: 'TC-10', module: 'Categories', description: 'Create custom expense category', input: 'Name: "Gym & Fitness", Type: Expense', expected: 'Category appears under expense dropdown and category ledger', status: 'PASS' },
  { id: 'TC-11', module: 'Reports', description: 'Filter records by month & year', input: 'Month: October, Year: 2026', expected: 'Calculates specific monthly totals & updates Chart.js datasets', status: 'PASS' },
  { id: 'TC-12', module: 'Reports', description: 'Download CSV file', input: 'Click "Export CSV"', expected: 'Triggers browser file download with properly formatted table rows', status: 'PASS' },
];

# Personal Expense Tracker - College Mini Project

A complete, full-stack, beginner-friendly web application developed with **Core PHP**, **MySQL (PDO)**, **Bootstrap 5**, and **Chart.js**.

---

## 1. Project Overview
- **Name:** Personal Expense Tracker
- **Target Audience:** College Mini Project / Viva Voce Examination / Portfolio
- **Backend:** Native / Core PHP (No frameworks)
- **Database:** MySQL with PDO (`expense_tracker`)
- **Frontend:** Bootstrap 5.3, Bootstrap Icons, Chart.js 4.4, Custom CSS/JS
- **Server:** XAMPP on Windows (Apache & MySQL)

---

## 2. Key Features
1. **User Authentication & Session Security:**
   - Registration with email duplication check.
   - Secure passwords using `password_hash($pass, PASSWORD_BCRYPT)`.
   - Verification using `password_verify($pass, $hash)`.
   - Session fixation protection using `session_regenerate_id(true)`.
   - Cross-Site Request Forgery (CSRF) token generation & validation on all state-changing actions.
2. **Financial Dashboard:**
   - Dynamic monthly total income, expenses, and remaining balance.
   - Monthly Income vs. Expense trend bar chart (Chart.js).
   - Category-wise expense distribution doughnut chart (Chart.js).
   - Quick action shortcuts to record income or expenses.
   - 5 most recent transactions with live indicators.
3. **Transaction Management (Full CRUD):**
   - Record income or expense transactions with amount, category, date, and description.
   - Edit and delete existing entries with confirmation dialogs.
   - Multi-parameter filtering: by transaction type, category, and date range.
   - Full-text description search.
   - Pagination (10 records per page).
   - Strict multi-tenant isolation: Users can only view, edit, or delete their own data (`WHERE user_id = :user_id`).
4. **Expense & Income Categories:**
   - Pre-loaded default global categories (Food, Transportation, Shopping, Education, Entertainment, Bills, etc.).
   - Support for custom user-created categories.
   - Income and expense categories are cleanly segregated.
5. **Reports, Analytics & CSV Export:**
   - Interactive month and year filter.
   - Annual cash flow bar charts.
   - Category percentage share calculation.
   - One-click CSV export with UTF-8 BOM encoding for seamless Microsoft Excel opening.
6. **User Profile & Security:**
   - Update user profile name.
   - Secure password update verifying current password.

---

## 3. Directory Structure
```
htdocs/expense-tracker/
├── index.php                 # Landing page / guest welcome
├── login.php                 # User login page
├── register.php              # User registration page
├── logout.php                # Session termination script
├── dashboard.php             # Core analytics dashboard with charts
├── transactions.php          # Filterable, paginated transaction ledger
├── add-transaction.php       # Add transaction form
├── edit-transaction.php      # Edit transaction form
├── categories.php            # Custom category manager
├── reports.php               # Financial report analytics & breakdown
├── export-csv.php            # Streamed CSV export handler
├── profile.php               # Profile and password update
├── config/
│   └── database.php          # PDO connection singleton
├── includes/
│   ├── auth.php              # Authentication guards
│   ├── csrf.php              # Anti-CSRF token generator & validator
│   ├── functions.php         # Sanitize, format, calculations
│   ├── header.php            # Common HTML header and navbar
│   ├── sidebar.php           # Dark navy sidebar navigation
│   └── footer.php            # HTML footer, Chart.js & script assets
├── actions/
│   ├── save-transaction.php  # INSERT transaction handler
│   ├── update-transaction.php# UPDATE transaction handler
│   ├── delete-transaction.php# DELETE transaction handler
│   ├── save-category.php     # INSERT custom category handler
│   ├── delete-category.php   # DELETE custom category handler
│   ├── update-profile.php    # UPDATE profile name handler
│   └── change-password.php   # UPDATE user password handler
├── assets/
│   ├── css/style.css         # Modern financial theme styles
│   └── js/app.js             # Dynamic DOM interactions & alerts
├── database/
│   └── expense_tracker.sql   # Complete database schema & seed data
└── README.md                 # Complete documentation & viva prep
```

---

## 4. Local Installation Guide (Windows + XAMPP)

### Step 1: Start Apache and MySQL
1. Open the **XAMPP Control Panel** from the Windows Start menu.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.
*(Both should turn green with active port numbers, typically 80 and 3306).*

### Step 2: Copy the Project into `htdocs`
1. Navigate to your XAMPP installation directory: `C:\xampp\htdocs\`.
2. Create a folder named `expense-tracker` (or extract this project's contents here):
   ```
   C:\xampp\htdocs\expense-tracker\
   ```

### Step 3: Import the Database
1. Open your browser and navigate to: `http://localhost/phpmyadmin/`.
2. Click on the **Databases** tab at the top.
3. Enter database name `expense_tracker` and click **Create**.
4. With `expense_tracker` selected on the left sidebar, click the **Import** tab.
5. Click **Choose File** and browse to:
   `C:\xampp\htdocs\expense-tracker\database\expense_tracker.sql`.
6. Click **Import** at the bottom.

### Step 4: Verify Database Connection
Open `config/database.php` in Visual Studio Code. Default XAMPP settings are:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'expense_tracker');
define('DB_USER', 'root');
define('DB_PASS', '');
```
*(If your MySQL has a password, enter it in `DB_PASS`).*

### Step 5: Launch the Application
Open your web browser and visit:
```
http://localhost/expense-tracker/
```

### Step 6: Demo Sign-in
- **Email:** `student@college.edu`
- **Password:** `password123`
*(Or register any new account on the registration page).*

---

## 5. Troubleshooting Common XAMPP / Windows Errors

1. **MySQL Port 3306 Conflict:**
   - *Problem:* XAMPP MySQL fails to start because port 3306 is occupied by an existing MySQL Windows Service.
   - *Fix:* In XAMPP Control Panel, click `Config` next to MySQL -> `my.ini`, change `port=3306` to `port=3307`, or open `services.msc` and stop the standalone `MySQL80` service.
2. **"Database Connection Failed" Error:**
   - *Problem:* Apache cannot reach MySQL or database does not exist.
   - *Fix:* Ensure MySQL is started in XAMPP and verify you created the database named `expense_tracker`.
3. **Session or Permission Errors:**
   - *Problem:* Session files cannot be written.
   - *Fix:* Ensure `C:\xampp\tmp\` exists and is writable.
4. **Blank White Screen:**
   - *Problem:* PHP error display disabled in `php.ini`.
   - *Fix:* In `php.ini`, set `display_errors = On` and restart Apache.

---

## 6. College Viva Voce Questions & Answers (25 Q&As)

### Q1: What is the purpose of this project?
**Ans:** To provide individuals and students with an easy-to-use digital system to track daily income and expenses, analyze monthly cash flow through interactive charts, and gain financial clarity.

### Q2: What is Core PHP and why was it chosen?
**Ans:** Core PHP is native PHP without using external frameworks like Laravel or CodeIgniter. It demonstrates strong fundamental programming skills, direct understanding of HTTP sessions, PDO, and MVC-like file separation.

### Q3: What is PDO and why is it preferred over `mysqli`?
**Ans:** PDO (PHP Data Objects) is a database abstraction layer providing a uniform method of access to multiple databases. It supports prepared statements, named parameters, and robust exception handling.

### Q4: How does this application prevent SQL Injection?
**Ans:** All queries containing user-supplied parameters use **PDO Prepared Statements** with parameterized placeholders (`:user_id`, `:email`). The SQL syntax is compiled first, and parameters are sent separately, eliminating code injection.

### Q5: How is user password security handled?
**Ans:** Passwords are never stored in plain text. We use `password_hash($password, PASSWORD_BCRYPT)`, which uses the slow, salted Blowfish hashing algorithm. Verification is done via `password_verify($password, $hash)`.

### Q6: What is Cross-Site Request Forgery (CSRF) and how is it prevented?
**Ans:** CSRF occurs when an unauthorized site forces a user's browser to execute state-changing actions while logged in. We prevent this by generating a cryptographically secure random token (`random_bytes(32)`) saved in the session, verified on every POST submission with `hash_equals()`.

### Q7: What is Cross-Site Scripting (XSS) and how is it mitigated?
**Ans:** XSS happens when malicious scripts are injected into web pages viewed by other users. We mitigate XSS by sanitizing and escaping all dynamic outputs using `htmlspecialchars($data, ENT_QUOTES, 'UTF-8')`.

### Q8: Why is `session_regenerate_id(true)` used upon login?
**Ans:** It replaces the existing session ID with a new one to prevent **Session Fixation attacks**, where an attacker pre-sets a known session ID.

### Q9: Why did you use `DECIMAL(10,2)` for money values instead of `FLOAT` or `DOUBLE`?
**Ans:** Floating-point numbers use binary representation, causing rounding inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`). `DECIMAL` stores exact base-10 numerical representations required for financial calculations.

### Q10: How does the application ensure multi-user data isolation?
**Ans:** Every query fetching, updating, or deleting transactions explicitly filters by `user_id = :user_id` obtained securely from `$_SESSION['user_id']`. A user cannot manipulate the transaction ID to modify someone else's data.

### Q11: What is the function of the `categories` table having `user_id` as NULL?
**Ans:** When `user_id` is `NULL`, it represents a global system category available to all users (e.g., Food, Transportation). When `user_id` has a numerical ID, it represents a custom category created solely by that user.

### Q12: How are the charts rendered on the dashboard?
**Ans:** We use **Chart.js**, a modern canvas-based JavaScript charting library. PHP queries the database, formats the data using `json_encode()`, and JavaScript renders interactive bar and doughnut charts.

### Q13: What does the CSV export feature do?
**Ans:** It queries filtered transactions and streams them directly to the browser using `fputcsv()`. It includes a UTF-8 BOM header (`\xEF\xBB\xBF`) so Microsoft Excel correctly displays currency and characters without encoding corruption.

### Q14: How does Bootstrap 5 differ from earlier versions?
**Ans:** Bootstrap 5 dropped jQuery dependency in favor of pure vanilla JavaScript, introduced CSS custom properties (variables), improved flexbox grid, and added Bootstrap Icons.

### Q15: What is the difference between GET and POST methods?
**Ans:** GET appends data in the URL query string (used for idempotent operations like searching, filtering, and page navigation). POST sends parameters inside the HTTP request body (used for secure state-changing actions like user registration, login, add, edit, and delete).

### Q16: How do flash messages work in this application?
**Ans:** A flash message is stored in `$_SESSION['flash']`. Once read by `includes/header.php`, it is immediately unset (`unset($_SESSION['flash'])`), so it displays only once and disappears upon the next request.

### Q17: What does `FOREIGN KEY ... ON DELETE CASCADE` mean?
**Ans:** If a user account is deleted from the `users` table, MySQL automatically cascades and deletes all linked transactions and custom categories associated with that `user_id`, preserving referential integrity.

### Q18: What is an index in MySQL and where did you use it?
**Ans:** An index is a data structure (like B-Tree) that speeds up data retrieval. We indexed `transaction_date`, `user_id`, and `category_id` to ensure queries remain fast even with thousands of records.

### Q19: What is `hash_equals()` in PHP?
**Ans:** It compares two strings in **constant time**, protecting against **timing attacks** where an attacker measures string comparison execution time to guess cryptographic tokens.

### Q20: What is the PRG (Post/Redirect/Get) pattern and why is it used?
**Ans:** When a form is submitted via POST, the server processes the data and sends an HTTP 302 redirect (`header("Location: ...")`) instead of rendering HTML directly. This prevents duplicate form submissions if the user refreshes the page.

### Q21: What are HTTP status codes?
**Ans:** 200 (OK), 302 (Found / Redirect), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error).

### Q22: What happens if a user submits negative numbers in transaction amount?
**Ans:** Server-side validation in `actions/save-transaction.php` checks `if ($amount <= 0)` and rejects the request with an error flash message, ensuring database integrity even if client-side validation is bypassed.

### Q23: How can this project be enhanced in the future?
**Ans:**
- Adding recurring subscription reminders.
- Monthly budget thresholds with email warnings.
- Multi-currency conversion via live exchange rate APIs.
- Receipt image uploads with OCR scanning.

### Q24: What is the purpose of `ob_get_level()` and `ob_end_clean()` in `export-csv.php`?
**Ans:** It clears any prior whitespace, HTML, or warning output buffer so the exported CSV file is clean and free from corruption.

### Q25: Why is XAMPP used for college projects?
**Ans:** XAMPP provides a pre-packaged, cross-platform Apache, MariaDB/MySQL, and PHP environment, making it effortless to set up a complete local development server on Windows without configuring each server individually.

// DOM Elements
const authContainer = document.getElementById('auth-container'); // Authentication container (Login/Signup)
const scoreboardContainer = document.getElementById('scoreboard-container'); // Container for the scoreboard
const loginForm = document.getElementById('login-form'); // Login form element
const signupForm = document.getElementById('signup-form'); // Signup form element
const resultForm = document.getElementById('result-form'); // Result submission form
const resultsBody = document.getElementById('results-body'); // Table body to display results
const searchInput = document.getElementById('search-input'); // Search input to filter results
const loginTab = document.getElementById('login-tab'); // Login tab button
const signupTab = document.getElementById('signup-tab'); // Sign up tab button

// Simple Storage
let users = JSON.parse(localStorage.getItem('users')) || []; // Get users from local storage, or initialize an empty array
let results = JSON.parse(localStorage.getItem('results')) || []; // Get results from local storage, or initialize an empty array
let currentUser = null; // Variable to store the currently logged-in user

// Event Listeners
loginForm.addEventListener('submit', handleLogin); // Login form submission
signupForm.addEventListener('submit', handleSignup); // Signup form submission
document.getElementById('logout-btn').addEventListener('click', handleLogout); // Logout button click
resultForm.addEventListener('submit', handleResultSubmit); // Result form submission
searchInput.addEventListener('input', showResults); // Handle search input to filter displayed results
loginTab.addEventListener('click', () => {//+
    loginForm.classList.remove('hidden'); // Show the login form//+
    signupForm.classList.add('hidden'); // Hide the signup form//+
    loginTab.classList.add('active'); // Add 'active' class to the login tab//+
    signupTab.classList.remove('active'); // Remove 'active' class from the signup tab//+
});//
// Tab Switching with Color Change
// Switch to login form
loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
});

// Switch to signup form
signupTab.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
});

// Basic Functions
// Save data to local storage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users)); // Save users array to local storage
    localStorage.setItem('results', JSON.stringify(results)); // Save results array to local storage
}

// Handle Login
function handleLogin(e) {
    e.preventDefault(); // Prevent form from submitting the default way
    const username = document.getElementById('login-username').value; // Get entered username
    const password = document.getElementById('login-password').value; // Get entered password

    // Find user matching username and password
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user; // Set the logged-in user
        showScoreboard(); // Show the scoreboard page
        loginForm.reset(); // Reset the login form
    } else {
        alert('Wrong username or password'); // Alert user if login failed
    }
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault(); // Prevent form from submitting the default way
    const username = document.getElementById('signup-username').value; // Get entered username
    const password = document.getElementById('signup-password').value; // Get entered password

    // Check if the username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already taken'); // Alert if username is taken
        return;
    }

    // Create new user object and push it into the users array
    const newUser = {
        id: Date.now(),
        username,
        password
    };
    users.push(newUser); // Add new user to the users array
    currentUser = newUser; // Set the new user as the logged-in user
    saveData(); // Save the updated users array to local storage
    showScoreboard(); // Show the scoreboard page
    signupForm.reset(); // Reset the signup form
}

// Handle Logout
function handleLogout() {
    currentUser = null; // Clear the currentUser variable
    authContainer.classList.remove('hidden'); // Show the login/signup container
    scoreboardContainer.classList.add('hidden'); // Hide the scoreboard container
}

// Handle Result Submission
function handleResultSubmit(e) {
    e.preventDefault(); // Prevent form from submitting the default way
    const studentName = document.getElementById('student-name').value; // Get entered student name
    const subject = document.getElementById('subject').value; // Get selected subject
    const score = document.getElementById('score').value; // Get entered score

    // Check if the result for this student and subject already exists
    const exists = results.some(r =>
        r.userId === currentUser.id &&
        r.studentName.toLowerCase() === studentName.toLowerCase() &&
        r.subject === subject
    );

    if (exists) {
        alert('Result already exists for this student and subject!'); // Alert if result exists
        return;
    }

    // Create a new result object
    const result = {
        id: Date.now(),
        userId: currentUser.id,
        studentName: studentName,
        subject: subject,
        score: score
    };

    results.push(result); // Add the result to the results array
    saveData(); // Save the updated results array to local storage
    resultForm.reset(); // Reset the result form
    showResults(); // Update the results table
}

// Show Scoreboard (Display after successful login)
function showScoreboard() {
    authContainer.classList.add('hidden'); // Hide the login/signup container
    scoreboardContainer.classList.remove('hidden'); // Show the scoreboard container
    document.getElementById('username-display').textContent = currentUser.username; // Display the logged-in username
    showResults(); // Display the results
}

// Show Results (Filter results based on search input)
function showResults() {
    const search = searchInput.value.toLowerCase(); // Get the search query (case-insensitive)
    resultsBody.innerHTML = ''; // Clear current results table

    // Filter results for the current user and search query
    const userResults = results.filter(r =>
        r.userId === currentUser.id &&
        (r.studentName.toLowerCase().includes(search) || r.subject.toLowerCase().includes(search))
    );

    // Create and display rows for each result
    userResults.forEach(result => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${result.studentName}</td>
            <td>${result.subject}</td>
            <td>${result.score}</td>
            <td>
                <button class="edit-btn" onclick="editResult(${result.id})">Edit</button>
                <button class="delete-btn" onclick="deleteResult(${result.id})">Delete</button>
            </td>
        `;
        resultsBody.appendChild(tr); // Append each result row to the table
    });
}

// Edit Result (Remove the old result and populate the form with the current result)
function editResult(id) {
    const result = results.find(r => r.id === id); // Find the result by ID
    if (result) {
        document.getElementById('student-name').value = result.studentName; // Fill student name field
        document.getElementById('subject').value = result.subject; // Fill subject field
        document.getElementById('score').value = result.score; // Fill score field
        deleteResult(id); // Delete the old result to allow updating
    }
}

// Delete Result
function deleteResult(id) {
    results = results.filter(r => r.id !== id); // Remove the result with the matching ID
    saveData(); // Save the updated results to local storage
    showResults(); // Re-display the results after deletion
}

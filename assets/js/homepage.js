// variables for submission form
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

// variables for repository column
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// function to get user input from form
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    // if user submitted a username, pass it as an argument to getUserRepos 
    if (username) {
        getUserRepos(username);

        // reset input field to blank
        nameInputEl.value = "";
    } else {
        // if user did not fill out anything, prompt them to do so
        alert("Please enter a GitHub username");
    }
};

// function to request data from the api and console.log it 
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url
    fetch(apiUrl).then(function(response) {

        // parse the response into a javascript array
        response.json().then(function(data) {
            // send converted data from getUserRepos to displayRepos
            displayRepos(data, user);
        });
    });
};

// function to accept both the array and term we searched for as parameters
var displayRepos = function(repos, searchTerm) {
    // clear old data
    repoContainerEl.textContent = "";

    // display user input in left column header
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement('div');
        repoEl.classList = 'list-item flex-row justify-space-between align-center';

        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // append title to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append status to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// event listener for form submission
userFormEl.addEventListener("submit", formSubmitHandler);
// reference variables for submission form
// ENTIRE FORM SECTION
var userFormEl = document.querySelector("#user-form");
// programming language section 
var languageButtonsEl = document.querySelector("#language-buttons")
// USER SEARCH INPUT
var nameInputEl = document.querySelector("#username"); 
// reference variables for repository display
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// function to get user input from form
var formSubmitHandler = function(event) {
    // prevent page from reloading when submit button is clicked
    event.preventDefault();

    // get value from input element
    var username = nameInputEl.value.trim();
    // if user submitted a username, pass it as an argument to getUserRepos 
    if (username) {
        getUserRepos(username);
        // clear old repos
        repoContainerEl.textContent = "";
        // reset input field to blank
        nameInputEl.value = "";
    } else {
        // if user did not fill out anything, prompt them to do so
        alert("Please enter a GitHub username");
    }
};
var buttonClickHandler = function(event) {
    // get the language attribute from the clicked element
    var language = event.target.getAttribute("data-language");
  
    // if clicked 
    if (language) {
        getFeaturedRepos(language);
  
        // clear old repos
        repoContainerEl.textContent = "";
    }
};

// function to request data from the api
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    // make request to the url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            // parse the response into a javascript array
            response.json().then(function(data) {
                // send converted data from getUserRepos to displayRepos
                displayRepos(data, user);
            });            
        } else {
            // alert the user that the GitHub user does not exist
            alert("Error: GitHub User Not Found");
        }
    })
    // if '.then' method fails, fetch() will use the '.catch' method below
    .catch(function(error) {
        // notice the '.catch()' getting chaines onto the end of the '.then' method
        alert("Unable to connet to GitHub");
    });
};

// language btn click function
var getFeaturedRepos = function(language) {
    // format the github api url
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayRepos(data.items, language);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    });
  };

// function to generate dom elements using the response data
var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old data
    repoContainerEl.textContent = "";
    // display user input in left column header
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement('a');
        // add classes to the newly created container
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        // add a link for the single-repo.html file 
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        // display the repository's name as the title
        titleEl.textContent = repoName;

        // create a status element
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';
        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            // apply red 'X' if there are issues
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
        } else {
            // apply blue '???' if there are no issues
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append title to container
        repoEl.appendChild(titleEl);
        // append status to container
        repoEl.appendChild(statusEl);
        // append repo container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// event listener for form submission
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
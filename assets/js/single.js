// reference variable for issues container
var issueContainerEl = document.querySelector("#issues-container");
// reference for limit warning container
var limitWarningEl = document.querySelector("#limit-warning");

// repo name function
var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
  
    // if repo name exists, then --
    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        // display issues of the repo
        getRepoIssues(repoName);
    } else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

// function to request data from the api
var getRepoIssues = function(repo) {
    // format the github api url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make request to the url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            // parse the response into a javascript array
            response.json().then(function(data) {
                // parse response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("link")) {
                    displayWarning(repo);
                }
            });            
        } else {
            // alert the user that there was a problem with the request
            alert("There was a problem with your request.");
        }
    });
};


// function to generate dom elements using the response data
var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues.";
        return;
    }
    // loop through response
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        // set the classes for the newly created element 
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // set the href to the url of the issue
        issueEl.setAttribute("href", issues[i].html_url);
        // open link url as a new tab
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // create a type element
        var typeEl = document.createElement("span");        
        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append title to issueEl container
        issueEl.appendChild(titleEl);
        // append type to issueEl container
        issueEl.appendChild(typeEl)
        // append issue container to the dom
        issueContainerEl.appendChild(issueEl); 
    }    
};

// function for limit warning message
var displayWarning = function(repo) {
    // add text to the warning container 
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    // create container for repo issues link
    var linkEl = document.createElement("a");
    // text with embedded link
    linkEl.textContent = "See More Issues on GitHub.com";
    // format link url to currently fetched repo
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    // open link url in new tab
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
getRepoIssues("angular/angular");
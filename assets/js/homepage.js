// variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

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
    console.log(event);
};

// function to request data from the api and console.log it 
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to the url
    fetch(apiUrl).then(function(response) {

        // parse the response into a javascript array
        response.json().then(function(data) {

            // log the array into the console
            console.log(data);
        });
    });
};

// event listener for form submission
userFormEl.addEventListener("submit", formSubmitHandler);
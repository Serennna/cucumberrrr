Feature: User Lpgin
    Scenario: Successful login with valid credentials 
        Given the user is on the login page
        When the user enters a valid username and password
        And clicks the login button 
        Then the user should be redirected to the home page
        
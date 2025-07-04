Feature: Login Navigations
    Background:
        Given the user is on the Sign In page

    Scenario Outline: User navigates to Sign In page as different roles successfully
        When the user clicks login as "<role>"
        When the user clicks the Get Started button 
        Then the user should be redirected to the "<role>" login page
    
    Examples:
    | role   |
    | Mentee |
    | Mentor |
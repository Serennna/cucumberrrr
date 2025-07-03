Feature: Mentor Sign In

Scenario: Mentor user login successfully
        When the user clicks login as "Mentor"
        And the user clicks the Get Started button 
        Then the user should be redirected to the "Mentor" login page
        When the mentor enters valid credentials
        And the mentor clicks the login button
        Then the mentor should be redirected to the mentor dashboard


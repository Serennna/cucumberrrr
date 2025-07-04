# mentorLogin.feature
Feature: Mentor Login

  Background:
    Given the user is on the Sign In page
    When the user clicks login as "Mentor"
    When the user clicks the Get Started button
    Then the user should be redirected to the "Mentor" login page

  Scenario: Mentor logs in successfully
    When the mentor enters valid credentials
    When the mentor clicks the Sign In button
    Then the user should be redirected to the mentor dashboard

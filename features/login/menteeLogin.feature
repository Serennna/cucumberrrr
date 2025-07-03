# menteeLogin.feature
Feature: Mentee Login

  Background:
    Given the user is on the Sign In page
    When the user clicks login as "Mentee"
    When the user clicks the Get Started button
    Then the user should be redirected to the "Mentee" login page

  Scenario: Mentee logs in successfully
    When the mentee enters valid credentials
    When the mentee clicks the Sign In button
    Then the user should be redirected to the Mentee dashboard

# menteeLogin.feature
Feature: Mentee Login

  Background:
    Given the user is on the Sign In page
    When the user clicks login as "Mentee"
    And the user clicks the Get Started button
    Then the user should be redirected to the "Mentee" login page

  Scenario: Mentee logs in successfully
    When the mentee enters valid credentials
    And the mentee clicks the Sign In button
    Then the user should be redirected to the Mentee dashboard

  Scenario: Mentee logs in using invalid credentials
    When the mentee enters invalid credentials
    And the mentee clicks the Sign In button
    Then the message "Invalid Credential. Please check your email or password and try again." should display

  Scenario: Password is required
    When the user enters empty password
    Then the explain error "Password is required" should display

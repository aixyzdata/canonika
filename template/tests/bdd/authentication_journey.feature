Feature: Template Service Authentication Journey
  As a user
  I want to access the Template Service
  So that I can validate the componentization

  Background:
    Given the Template Service is running on port 3790
    And the Quarter Service is running on port 3700
    And the Harbor Service is running on port 3701
    And I am not authenticated

  Scenario: Access Template Service without authentication
    When I access "http://localhost:3790"
    Then I should be redirected to "http://localhost:3700"
    And the redirect URL should contain "redirect_to=http%3A%2F%2Flocalhost%3A3790%2F"

  Scenario: Login through Quarter and return to Template
    Given I am on the Quarter login page
    When I fill in the email with "admin@canonika.io"
    And I fill in the password with "admin123"
    And I click the login button
    Then I should be redirected to "http://localhost:3790"
    And I should see the Template Service dashboard
    And I should be authenticated

  Scenario: Logout from Template Service
    Given I am authenticated on the Template Service
    When I click the logout button
    Then I should be redirected to "http://localhost:3700"
    And I should not be authenticated

  Scenario: Direct access to Template with valid token
    Given I have a valid authentication token
    When I access "http://localhost:3790?auth_token=VALID_TOKEN"
    Then I should see the Template Service dashboard
    And I should not be redirected to Quarter

  Scenario: Access Template with expired token
    Given I have an expired authentication token
    When I access "http://localhost:3790?auth_token=EXPIRED_TOKEN"
    Then I should be redirected to "http://localhost:3700"
    And the redirect URL should contain "redirect_to=http%3A%2F%2Flocalhost%3A3790%2F"

  Scenario: Template Service with missing shared styles
    Given I am authenticated on the Template Service
    When I access the Template Service dashboard
    Then all shared styles should load successfully
    And I should not see 404 errors for CSS files 
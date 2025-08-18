Feature: AG-Grid Visibility Test
  As a user
  I want to see the AG-Grid properly rendered on the SEFAZ page
  So that I can view and interact with the data

  Background:
    Given I am on the SEFAZ page
    And the page has loaded completely

  Scenario: AG-Grid should be visible with proper height
    When I look at the AG-Grid container
    Then I should see the AG-Grid element with class "ag-theme-quartz"
    And the AG-Grid should have a height of at least 400px
    And the AG-Grid should have a width of 100%

  Scenario: AG-Grid should display headers and rows
    When I examine the AG-Grid content
    Then I should see column headers in the grid
    And I should see data rows in the grid
    And the grid should not be empty

  Scenario: AG-Grid should have pagination controls
    When I look at the AG-Grid pagination
    Then I should see pagination controls
    And the pagination should show "Page Size: 20"
    And the pagination should show page numbers

  Scenario: AG-Grid should respond to theme changes
    When I check the AG-Grid theme
    Then the AG-Grid should have the Canonika theme applied
    And the grid should have dark blue color scheme 
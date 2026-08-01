Feature: Sorting Validation
  As a shopper on the inventory page
  I want to sort items by price
  So that I can browse them in ascending price order

  Scenario: Sort items by price ascending
    Given the user is logged in as "standard_user"
    Then there should be 6 items in the inventory
    When the user selects "Price (low to high)" from the sort dropdown
    Then the displayed item prices should be sorted in ascending order
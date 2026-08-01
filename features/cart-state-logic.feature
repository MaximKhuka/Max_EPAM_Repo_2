Feature: Cart State Logic
  As a shopper
  I want to add and remove items from my cart
  So that the cart badge accurately reflects my selections

  Scenario Outline: Add two items and remove one
    Given the user is logged in as "standard_user"
    When the user adds "<firstItem>" and "<secondItem>" to the cart
    Then the cart badge should be displayed
    And the cart badge should show "2"
    When the user removes "<itemToRemove>" from the cart
    Then the cart badge should show "1"

    Examples:
      | firstItem               | secondItem               | itemToRemove             |
      | Sauce Labs Backpack      | Sauce Labs Bike Light     | Sauce Labs Backpack       |
      | Sauce Labs Bolt T-Shirt  | Sauce Labs Fleece Jacket  | Sauce Labs Fleece Jacket  |
Feature: Product Management
  As a system user
  I want to manage products
  So that I can maintain the product catalog

  Scenario: Create a new product
    Given a category with id "123e4567-e89b-12d3-a456-426614174000" exists
    When I create a product with the following details:
      | name        | Test Product        |
      | description | Test Description    |
      | price       | 19.99               |
      | categoryId  | 123e4567-e89b-12d3-a456-426614174000 |
      | available   | true                |
    Then the product should be created successfully
    And the product should have the name "Test Product"
    And the product should have the price 19.99

  Scenario: List products by category
    Given a category with id "123e4567-e89b-12d3-a456-426614174000" exists
    And the following products exist:
      | name      | description   | price | categoryId                           | available |
      | Product 1 | Description 1 | 10.99 | 123e4567-e89b-12d3-a456-426614174000 | true      |
      | Product 2 | Description 2 | 15.99 | 123e4567-e89b-12d3-a456-426614174000 | true      |
    When I list products for category "123e4567-e89b-12d3-a456-426614174000"
    Then I should see 2 products
    And the first product should be "Product 1"

  Scenario: Update product price
    Given a category with id "123e4567-e89b-12d3-a456-426614174000" exists
    And a product with id "987e6543-e21b-12d3-a456-426614174000" exists with price 10.99
    When I update the product price to 15.99
    Then the product price should be 15.99

  Scenario: Cannot create product with invalid data
    Given a category with id "123e4567-e89b-12d3-a456-426614174000" exists
    When I try to create a product with invalid data:
      | name        |          |
      | description | Test     |
      | price       | 0        |
      | categoryId  | 123e4567-e89b-12d3-a456-426614174000 |
    Then the product creation should fail

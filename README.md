
# exbanking service functional automation test-module

This project is a functional automation testing suite for the Exbanking Management Service, evaluated using Cypress headless mode. Test cases are written covering the main scenarios increate user, deposit money, withdraw money, fund transfer, and account inquiry flows, with both positive and negative test cases.

## Prerequisites

- npm 6.14.11
- node v14.16.0

## Building the Project

To build the automation testing project, run the following command:

```sh
npm install
```
## Starting the Exbanking Management Service

Before executing the load tests, start the Exbanking Management Service application by running the following command from the parent directory:
```sh
java -jar external-management-service.jar
```

This command will install all necessary dependencies for the project, including Cypress and any other required packages.

## Running the Tests

To execute the automation tests, use the following command:

```sh
npm test
```

This command will start the Cypress test runner and execute the defined test cases.

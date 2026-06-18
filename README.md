Employee Directory Project

This is an Angular application for an employee directory. It uses Firebase for the database and also saves to local storage.

Features:
- View all employees in a list
- Search for employees by name
- Filter by status (Active or Inactive)
- Sort the list A-Z or Z-A
- Add, edit, and delete employees
- See employee details
- Validation to stop @test.com emails
- Lazy loading for the routes

Technologies used:
- Angular 21
- Angular Material
- RxJS
- Firebase
- LocalStorage
- Signals for state
- TypeScript
- Vitest for testing

Folder Structure:
src/app/core/services - has the api and store and local storage services
src/app/features/employees/pages - has the list, form, and details pages
src/app/features/employees/components - has the table, filter, and delete dialog
src/app/features/employees/models - has the employee model
src/app/shared/validators - has the custom email validator
src/app/ - has the main app files like routing and app component

How to run the project:

Install everything:
npm install

Run the app:
ng serve
Then go to http://localhost:4200/

Build:
ng build

Run tests:
ng test

Why I chose these things:
- Signals: I used Signals because it's the new way in Angular and it's easier to learn.
- Local storage: I added it just in case Firebase doesn't work, so the app still runs.
- Angular Material: I used it because it looks good and is made for Angular.
- Architecture: I separated the pages from the dumb components to make it cleaner.

Assumptions:
- Firebase is open without auth
- Firebase makes the IDs
- It's just a simple project

Things to add later:
- Login screen
- Pagination
- Export to PDF

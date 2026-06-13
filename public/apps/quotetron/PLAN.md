# Quotetron Plan

## Scope

Quotetron helps freelancers, laborers, and side-hustlers decide whether a job quote is worth taking after time, expenses, fees, and profit targets.

## Audience

Freelancers, consultants, makers, and side-hustlers who need a quick sanity check before accepting a project.

## Primary Use Case

Enter project price, estimated hours, expenses, platform fees, and desired hourly rate to see the true hourly rate, break-even quote, and take-or-negotiate guidance. If the user does not know what to charge, they can use the rate helper to pick a task type and get a starting hourly range.

## Architecture

Static HTML, CSS, and JavaScript. No framework, backend, database, account system, or paid API is required. All quote calculations run in the visitor's browser.

## Risks

- This is planning math, not tax, legal, or financial advice.
- Analytics tokens should be configured during final deployment.

## User Stories

- As a mobile visitor, I can load and use the app without installing anything.
- As a freelancer, I can enter a quote and see the true hourly rate after hidden costs.
- As a freelancer, I can compare my quote against the minimum quote required to hit my target rate.
- As a freelancer, I can pick a job type and get a practical starting rate before I make the quote.
- As a visitor, I can share the app with a friend.
- As the site owner, I can deploy and maintain the app with low overhead.

# The Carpet Lab — Lead Management Automation

## Project Overview

A Google Workspace automation system designed to capture cleaning inquiries, send automated emails, and track leads efficiently.

This project demonstrates how Google Forms, Google Sheets, and Google Apps Script can work together to automate repetitive administrative tasks for a cleaning business.

## The Problem

Cleaning businesses receive inquiries from potential customers and need to record their details, acknowledge inquiries, notify the business owner, and track each lead. Managing these tasks manually can be time-consuming.

## The Solution

I built an automated lead management workflow that collects customer inquiries through Google Forms, stores responses in Google Sheets, and uses Google Apps Script to send customer confirmation emails and owner notifications.

## Workflow

1. A customer submits the cleaning inquiry form.
2. The form response is saved in Google Sheets.
3. Google Apps Script processes the new submission.
4. The customer receives a confirmation email.
5. The business owner receives an inquiry notification.
6. Email statuses and automation results are recorded in the spreadsheet.
7. Each new lead is assigned the status **New** for follow-up.

## Key Features

- Automated inquiry collection
- Centralized lead database in Google Sheets
- Customer confirmation emails
- Business owner email notifications
- Lead status tracking: New, Contacted, Booked, Completed, and Lost
- Separate customer and owner email status tracking
- Automation status and error logging
- Duplicate-processing protection for completed leads
- Script locking to reduce concurrent processing
- Installable form-submission trigger

## Technology Stack

- **Google Forms:** Customer inquiry collection
- **Google Sheets:** Lead storage and tracking
- **Google Apps Script:** Workflow automation
- **Gmail / MailApp:** Automated email notifications
- **Installable trigger:** Runs the workflow when a form is submitted

## Customer Information Collected

The inquiry form collects the customer's name, email address, optional phone number, requested cleaning service, number of rooms, preferred service date, and additional details.

## Testing and Validation

The workflow was tested using actual submissions through the connected Google Form.

Successful tests confirmed that:

- Form responses appeared in Google Sheets.
- Customer confirmation emails were sent.
- Owner notification emails were sent.
- Email status columns were updated.
- The automation status changed to Completed.
- New leads were initialized with the New status.
- The error details field remained blank during successful runs.

These tests confirm successful test runs but do not guarantee inbox delivery or cover every possible failure scenario.

## Business Benefits

- Reduces repetitive administrative work.
- Organizes customer inquiries in one place.
- Makes lead progress easier to track.
- Improves consistency in responding to new inquiries.
- Provides a foundation for further business automation.

## Future Improvements

- Automated follow-up emails for unbooked leads
- Appointment reminders
- Daily or weekly lead reports
- Lead source tracking
- CRM integration

## Security and Configuration

This repository is intended as a portfolio demonstration. Private email addresses, customer information, credentials, and other sensitive details should not be published.

Business-specific settings should be replaced with placeholders in public code and configured privately when deploying the automation for a business.

The workflow should be tested and configured for each business before production use.

## Author

**Saad Yousuf**

GitHub: https://github.com/Saad-Yousuf

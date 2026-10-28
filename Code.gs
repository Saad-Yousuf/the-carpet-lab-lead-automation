
function sendLeadConfirmation(e) {
  if (!e || !e.range) {
    throw new Error(
      "Submit the linked Google Form to test this function. Do not use Run."
    );
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = e.range.getSheet();
    const row = e.range.getRow();

    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    const values = sheet
      .getRange(row, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    const getValue = (header) => {
      const index = headers.indexOf(header);
      return index === -1 ? "" : values[index];
    };

    const getColumn = (header) => {
      const index = headers.indexOf(header);
      if (index === -1) {
        throw new Error("Missing column: " + header);
      }
      return index + 1;
    };

    const customerStatusCol = getColumn("Customer Email Status");
    const ownerStatusCol = getColumn("Owner Email Status");
    const automationStatusCol = getColumn("Automation Status");
    const errorDetailsCol = getColumn("Error Details");

    const customerStatus = sheet.getRange(row, customerStatusCol);
    const ownerStatus = sheet.getRange(row, ownerStatusCol);
    const automationStatus = sheet.getRange(row, automationStatusCol);
    const errorDetails = sheet.getRange(row, errorDetailsCol);

    const leadStatusCol = getColumn("Lead Status");
    const leadStatus = sheet.getRange(row, leadStatusCol);

    if (!leadStatus.getValue()) {
        leadStatus.setValue("New");
    }

    // Do not process a completed lead again.
    if (automationStatus.getValue() === "Completed") {
      console.log("Row " + row + " already completed. Skipping.");
      return;
    }

    automationStatus.setValue("Processing");
    errorDetails.setValue("");

    const name = getValue("Full Name");
    const customerEmail = getValue("Email Address");
    const phone = getValue("Phone Number");
    const service = getValue("Service Required");
    const rooms = getValue("Number of Rooms");
    const preferredDate = getValue("Preferred Service Date");
    const details = getValue("Additional Details");

    const errors = [];

    // Send an email only if it has not already been marked Sent.
    function sendTrackedEmail(statusCell, recipient, subject, body, label) {
      const currentStatus = statusCell.getValue();

      if (currentStatus === "Sent") {
        return;
      }

      // A previous execution may have stopped during sending.
      // Avoid an automatic duplicate; review this row manually.
      if (currentStatus === "Sending") {
        errors.push(
          label + ": Previous attempt has status Sending. Manual review required."
        );
        return;
      }

      if (!recipient) {
        statusCell.setValue("Failed");
        errors.push(label + ": Recipient email is missing.");
        return;
      }

      statusCell.setValue("Sending");

      try {
        MailApp.sendEmail(recipient, subject, body);
        statusCell.setValue("Sent");
      } catch (err) {
        statusCell.setValue("Failed");
        errors.push(label + ": " + err.message);
      }
    }

    // 1. Customer confirmation
    const customerMessage =
      "Hi " + name + ",\n\n" +
      "Thank you for contacting The Carpet Lab!\n\n" +
      "We've received your cleaning inquiry and our team " +
      "will review your request and get back to you.\n\n" +
      "Thank you,\nThe Carpet Lab Team";

    sendTrackedEmail(
      customerStatus,
      customerEmail,
      "We've received your cleaning inquiry!",
      customerMessage,
      "Customer email"
    );

    // 2. Owner notification
    const ownerMessage =
      "A new cleaning inquiry has been submitted.\n\n" +
      "CUSTOMER DETAILS\n" +
      "Name: " + name + "\n" +
      "Email: " + customerEmail + "\n" +
      "Phone: " + phone + "\n\n" +
      "SERVICE DETAILS\n" +
      "Service Required: " + service + "\n" +
      "Number of Rooms: " + rooms + "\n" +
      "Preferred Date: " + preferredDate + "\n" +
      "Additional Details: " + details + "\n\n" +
      "Please follow up with this customer.\n\n" +
      "The Carpet Lab Lead Automation";

    sendTrackedEmail(
      ownerStatus,
      "thecarpetlab86@gmail.com",
      "New Cleaning Lead - The Carpet Lab",
      ownerMessage,
      "Owner email"
    );

    if (errors.length === 0) {
      automationStatus.setValue("Completed");
      errorDetails.setValue("");
    } else {
      automationStatus.setValue("Failed");
      errorDetails.setValue(errors.join(" | "));
    }

    console.log(
      "Row " + row + " finished with status: " +
      automationStatus.getValue()
    );

  } catch (err) {
    // Record unexpected errors where possible.
    try {
      const sheet = e.range.getSheet();
      const row = e.range.getRow();
      const headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];

      const statusIndex = headers.indexOf("Automation Status");
      const errorIndex = headers.indexOf("Error Details");

      if (statusIndex !== -1) {
        sheet.getRange(row, statusIndex + 1).setValue("Failed");
      }

      if (errorIndex !== -1) {
        sheet.getRange(row, errorIndex + 1).setValue(err.message);
      }
    } catch (loggingError) {
      console.error("Could not record error: " + loggingError.message);
    }

    throw err;
  } finally {
    lock.releaseLock();
  }
}

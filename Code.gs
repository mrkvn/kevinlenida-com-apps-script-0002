function doGet() {
    return HtmlService.createTemplateFromFile("index")
        .evaluate()
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// CONSTANTS
TIMESHEET_TABLE = "timesheet";

/**
 * Returns a UUID.
 * @return UUID.
 * @customfunction
 */
function UUID() {
    return Utilities.getUuid();
}

function getCurrentDateTimeDay() {
    const now = new Date();

    // Format the current date
    const formattedDate = Utilities.formatDate(
        now,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
    );

    // Format the current time
    const formattedTime = Utilities.formatDate(
        now,
        Session.getScriptTimeZone(),
        "HH:mm:ss"
    );

    // Get the day of the week
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const dayOfWeek = days[now.getDay()];

    return {
        date: formattedDate,
        time: formattedTime,
        day: dayOfWeek,
    };
}

function clock(action, employee_id, latitude, longitude) {
    const key = Session.getTemporaryActiveUserKey();
    const { date, time, day } = getCurrentDateTimeDay();
    data = {
        id: UUID(),
        type: action,
        employee_id,
        time,
        date,
        day,
        key,
        latitude,
        longitude,
        lat_long: `${latitude} ${longitude}`,
    };
    const sheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TIMESHEET_TABLE);

    // Get all data in the sheet
    const sheetData = sheet.getDataRange().getValues();

    // Get the header row
    const headers = sheetData[0];

    // Create a new row array with the same length as headers
    const newRow = new Array(headers.length).fill("");

    // Populate the new row with data from the object
    for (let key in data) {
        const columnIndex = headers.indexOf(key);
        if (columnIndex !== -1) {
            newRow[columnIndex] = data[key];
        }
    }

    // Append the new row to the sheet
    sheet.appendRow(newRow);
    return data["time"];
}

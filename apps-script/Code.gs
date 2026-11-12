/** Standalone public read-only feed for a NEW Apps Script project.
 * Only rows and fields listed here are published. Anyone with the endpoint URL can read them.
 */
const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID';
const TABS = ['Itinerary', 'Stays', 'Ideas', 'Budget', 'Trip Info'];
const PUBLIC_FIELDS = {
  'Itinerary': ['ID', 'Date', 'Destination', 'Time', 'Category', 'Activity', 'Address', 'Map URL', 'Website URL', 'Estimated Cost ($)', 'Status', 'Photo URL', 'Reservation Link', 'Notes'],
  'Stays': ['Stay ID', 'Destination', 'Check-in', 'Check-out', 'Property', 'Address', 'Website', 'Total Cost ($)', 'Status', 'Notes'],
  'Ideas': ['Idea ID', 'Destination', 'Type', 'Name', 'Why Visit', 'Website', 'Map URL', 'Estimated Cost ($)', 'Priority', 'Status', 'Notes'],
  'Budget': ['Category', 'Estimated ($)', 'Notes'],
  'Trip Info': ['Field', 'Value', 'Notes']
};

function getTripData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = {};
  TABS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) throw new Error('Missing sheet tab: ' + name);
    const rows = sheet.getDataRange().getDisplayValues();
    const headers = rows[0].map(value => String(value).trim());
    sheets[name] = rows.slice(1)
      .filter(row => row.some(value => String(value).trim() !== ''))
      .map(row => Object.fromEntries(PUBLIC_FIELDS[name].map(field => {
        const index = headers.indexOf(field);
        return [field, index < 0 ? '' : row[index] || ''];
      })));
  });
  // Only organizer-approved ideas become publicly visible.
  sheets.Ideas = sheets.Ideas.filter(row => row.Status.toLowerCase() === 'approved');
  return { updatedAt: new Date().toISOString(), sheets };
}

function doGet(event) {
  if (!event || !event.parameter || event.parameter.callback !== 'travelAppCallback') {
    return ContentService.createTextOutput('Invalid callback');
  }
  const payload = JSON.stringify(getTripData())
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return ContentService
    .createTextOutput('travelAppCallback(' + payload + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function testConnection() {
  const data = getTripData();
  Object.keys(data.sheets).forEach(name => console.log(name + ': ' + data.sheets[name].length));
}

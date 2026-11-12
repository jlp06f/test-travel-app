# Travel App Factory — reusable trip itinerary

A free GitHub Pages travel itinerary starter. **This repository is a master template, not a one-click AI generator.** It uses fictional sample data and does not touch California Escape.

## Included

- `index.html`: mobile-ready website (Home, Itinerary, Stays, Ideas, Budget, Info), countdown, maps and optional activity photos.
- `config.json`: trip name, dates, time zone, destination cards, color, images, optional guest Google Form URL.
- `itinerary.json`: public sample data; optionally updated automatically by Google Sheets sync.
- `sheet-starter/`: five CSV header templates for Google Sheets tabs.
- `apps-script/Code.gs`: read-only Google Apps Script web endpoint.
- `scripts/sync_itinerary.py`: download/validate public JSONP and publish same-origin JSON.
- `.github/workflows/sync-itinerary.yml`: manual and best-effort scheduled update workflow.
- `assets/apple-touch-icon.png`: default iPhone Home Screen icon.

## Use this template for a new trip

1. On this GitHub repository, choose **Use this template → Create a new repository**. Use a unique repository name for the trip, and keep it public for free GitHub Pages hosting.
2. In the new repository, edit `config.json` (trip name, YYYY-MM-DD start/end dates, IANA time zone, destinations, optional hero image, optional guest-suggestion Form URL).
3. Edit `itinerary.json` to populate a static itinerary, or configure the optional Google Sheet below. This file is public.
4. Under **Settings → Pages**, choose **Deploy from a branch → main → / (root)**. The site will be at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.
5. To customize the iPhone Home Screen icon, replace `assets/apple-touch-icon.png` with your own 180×180 PNG.

## Optional: edit in Google Sheets

1. Create a new Google spreadsheet with tabs named **Itinerary**, **Stays**, **Ideas**, **Budget**, and **Trip Info**. Import the corresponding CSV header file from `sheet-starter/` into each tab (File → Import → Upload, replace current sheet), or copy its first row manually. **Do not rename header fields.**
2. Create a new standalone project at https://script.google.com, paste `apps-script/Code.gs`, and replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` with the spreadsheet ID.
3. Run `testConnection()` and authorize access. Deploy → New deployment → Web app, **Execute as Me**, **Who has access: Anyone** (anonymous), then copy the `/exec` URL. The feed is public, even when the spreadsheet is private.
4. Verify `YOUR_EXEC_URL?callback=travelAppCallback` starts with `travelAppCallback(` in an incognito window.
5. In the new trip's GitHub repo, create an **Actions repository variable** `TRAVEL_API_URL` containing the Apps Script `/exec` URL (no query). Set **Settings → Actions → General → Workflow permissions** to allow workflow content writes, if GitHub policy permits it.
6. Run **Actions → Sync travel itinerary → Run workflow**. Verify the commit changes `itinerary.json`, then verify Pages refreshed. Scheduled GitHub Actions runs can be delayed or skipped; run manually for urgent changes.

**Note:** The scheduled workflow should remain disabled or unconfigured on the master template. It requires a separate `TRAVEL_API_URL` for every new trip; until configured, manual/scheduled sync will fail rather than overwrite sample data.

## Friends' ideas (no voting yet)

1. Create a Google Form with Idea Name, Destination, Type, Why Visit, Website, Preferred Date, and optionally Suggested By. Avoid collecting personal details.
2. Link Form responses to a separate Google Sheet for organizer review.
3. Paste the form URL into `config.json` as `suggestionFormUrl`; the app then displays **Suggest an activity**.
4. Review submissions and manually copy accepted suggestions into your main spreadsheet's **Ideas** tab, set a unique `Idea ID` and `Status` to `Approved`.
5. Approved ideas appear on the public Ideas page after publishing. Add an item separately to **Itinerary** when you decide to schedule it. Voting is reserved for a future version.

## Test locally

Run `python -m http.server 8000 --bind 127.0.0.1` in the repository folder and open http://127.0.0.1:8000/ . Do not open `index.html` as a `file://` URL because it uses `fetch()`.

## Security and limits

GitHub Pages, `config.json`, `itinerary.json`, and the Apps Script feed are publicly readable. **Never put credentials, booking references, private room numbers, or personal details in published fields.** The feed uses explicit column allowlists but notes and addresses remain public. Google Form submissions do not automatically publish; organizer approval is manual. Budget is estimated only. The website's Refresh button reloads the last GitHub-published JSON, not live Google Sheets. This starter does not include voting, visitor logins or a one-click Google provisioning agent.

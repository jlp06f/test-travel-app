#!/usr/bin/env python3
"""Fetch public travel JSONP, validate its schema, and publish same-origin JSON."""
import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_URL = os.environ.get('TRAVEL_API_URL', '').strip()
CALLBACK = 'travelAppCallback'
OUTPUT = Path(__file__).resolve().parents[1] / 'itinerary.json'

if not API_URL.startswith('https://script.google.com/macros/s/') or not API_URL.endswith('/exec'):
    raise SystemExit('TRAVEL_API_URL must be your Apps Script public /exec URL')

request = Request(
    API_URL + '?' + urlencode({'callback': CALLBACK}),
    headers={'User-Agent': 'TravelAppFactory/1.0'}
)
with urlopen(request, timeout=35) as response:
    body = response.read(4_000_000).decode('utf-8-sig').strip()

prefix = CALLBACK + '('
if not (body.startswith(prefix) and body.endswith(');')):
    raise SystemExit('Expected JSONP; make sure Apps Script access is Anyone (anonymous).')

data = json.loads(body[len(prefix):-2])
required = ['Itinerary', 'Stays', 'Ideas', 'Budget', 'Trip Info']
if not isinstance(data.get('sheets'), dict) or any(not isinstance(data['sheets'].get(k), list) for k in required):
    raise SystemExit('Required sheet tabs missing; refusing to overwrite itinerary.json')

# Defense in depth: explicit public-field allowlists.
allowed = {
    'Itinerary': ['ID','Date','Destination','Time','Category','Activity','Address','Map URL','Website URL','Estimated Cost ($)','Status','Photo URL','Reservation Link','Notes'],
    'Stays': ['Stay ID','Destination','Check-in','Check-out','Property','Address','Website','Total Cost ($)','Status','Notes'],
    'Ideas': ['Idea ID','Destination','Type','Name','Why Visit','Website','Map URL','Estimated Cost ($)','Priority','Status','Notes'],
    'Budget': ['Category','Estimated ($)','Notes'],
    'Trip Info': ['Field','Value','Notes']
}
for name in required:
    cleaned = []
    for row in data['sheets'][name]:
        if not isinstance(row, dict):
            raise SystemExit('Unexpected row type in ' + name)
        cleaned.append({key: row.get(key, '') for key in allowed[name]})
    data['sheets'][name] = cleaned

data['sheets']['Ideas'] = [
    row for row in data['sheets']['Ideas']
    if str(row['Status']).lower() == 'approved'
]

OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Synced ' + ', '.join(name + '=' + str(len(data['sheets'][name])) for name in required))

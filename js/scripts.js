const court_levels = {
	'Agency': 'AGCY',
	'Apellate (Highest)': 'APHI',
	'Apellate (Intermediate)': 'APIM',
	'Arbitration Service': 'ARBS',
	'Authority': 'AUTH',
	'Bankruptcy': 'BANK',
	'Board': 'BORD',
	'Circuit': 'CIRC',
	'Claims': 'CLMS',
	'Common Pleas': 'CMPL',
	'Criminal': 'CRMN',
	'District': 'DIST',
	'Family/Domestic Relations': 'FAML',
	'Housing': 'HOUS',
	'Land': 'LAND',
	'Magistrate': 'MAGI',
	'Mediation Service': 'MEDI',
	'Probate': 'PROB',
	'Small Claims': 'SMCL',
	'Superior': 'SUPR',
	'Unknown': 'UNKN'
};

const states = {
	'Alabama': 'AL01',
	'Alaska': 'AK01',
	'Alberta': 'ALBR',
	'All States': 'ALLS',
	'Arizona': 'AZ01',
	'Arkansas': 'AR01',
	'British Columbia': 'BRCO',
	'California': 'CA01',
	'Canada': 'CANA',
	'China': 'CHN5',
	'Colorado': 'CO01',
	'Connecticut': 'CT01',
	'Delaware': 'DE01',
	'District of Columbia': 'DC01',
	'Florida': 'FL01',
	'Georgia': 'GA01',
	'Guam, US': 'GU01',
	'Hawaii': 'HI01',
	'Idaho': 'ID01',
	'Illinois': 'IL01',
	'Indiana': 'INDA',
	'Iowa': 'IA01',
	'Kansas': 'KS01',
	'Kentucky': 'KY01',
	'Louisiana': 'LA01',
	'Maine': 'ME01',
	'Maryland': 'MD01',
	'Massachusetts': 'MA01',
	'Mexico': 'MEXI',
	'Michigan': 'MI01',
	'Minnesota': 'MN01',
	'Mississippi': 'MISS',
	'Missouri': 'MISO',
	'Montana': 'MT01',
	'Multi-State': 'MU01',
	'Nebraska': 'NE01',
	'Nevada': 'NV01',
	'New Hampshire': 'NH01',
	'New Jersey': 'NJ01',
	'New Mexico': 'NM01',
	'New York': 'NY01',
	'Newfoundland and Labrador': 'NFLL',
	'North Carolina': 'NC01',
	'North Dakota': 'ND01',
	'Ohio': 'OH01',
	'Oklahoma': 'OK01',
	'Ontario': 'ONTR',
	'Oregon': 'OR01',
	'Pennsylvania': 'PA01',
	'Puerto Rico': 'PU01',
	'Quebec': 'QBEC',
	'Rhode Island': 'RI01',
	'South Carolina': 'SC01',
	'South Dakota': 'SD01',
	'Tennessee': 'TN01',
	'Texas': 'TX01',
	'Utah': 'UT01',
	'Vermont': 'VT01',
	'Virgin Islands, US': 'VU01',
	'Virginia': 'VA01',
	'Washington': 'WA01',
	'West Virginia': 'WV01',
	'Wisconsin': 'WI01',
	'Wyoming': 'WY01'
};

window.onload = ()=> {
	let stateSelect = document.getElementById('state-select');
	for(key in states) {
		let option = document.createElement('OPTION');
		option.innerText = key;
		option.value = key;
		stateSelect.appendChild(option);
	}

	let courtSelect = document.getElementById('court-level-select');
	for(key in court_levels) {
		let option = document.createElement('OPTION');
		option.innerText = key;
		option.value = key;
		courtSelect.appendChild(option);
	}

	document.getElementById('gen-btn').onclick = generateXML;
	document.getElementById('download-btn').onclick = downloadXML;
	document.getElementById('copy-btn').onclick = copyXML;
};

function generateXML() {
	document.getElementById('output').value = getXML();
}

function copyXML() {
	generateXML();

	document.getElementById('output').select();
	document.execCommand('copy');
}

function downloadXML() {
	generateXML();

	const data = [getXML()];
	const properties = {type: 'plain/text'};
	try {
		file = new File(data, 'venue.txt', properties);
	} catch(e) {
		file = new Blob(data, properties);
	}
	let link = document.createElement('A');
	link.download = 'venue.txt';
	link.href = URL.createObjectURL(file);
	link.click();
}

function getXML() {
	let now = new Date();
	let formated_date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;

	const full_name = document.getElementById('venue-name-input').value.trim();
	const county = document.getElementById('county-name-input').value.trim();
	const state = document.getElementById('state-select').value;
	const court_level = document.getElementById('court-level-select').value;

	const state_code = 'USST_ROOT_' + states[state];
	const court_level_code = 'CTLV_ROOT_' + court_levels[court_level];

	return `<?xml version="1.0" encoding="UTF-8"?>
	<TeamConnectRequest>
		<Authentication>
			<Username>tc_xml</Username>
			<Password>replaceme</Password>
		</Authentication>

		<Contact op="insert" OverrideDuplicateCheck="true">
			<Type>C</Type>
			<DefaultCategory>CONT_EXTL_VENU</DefaultCategory>
			<Name>${full_name}</Name>

			<Detail key="CONT_EXTL_VENU">
				<CnVnCounty>${county}</CnVnCounty>
				<CnVnLevel>${court_level_code}</CnVnLevel>
				<CnVnState>${state_code}</CnVnState>
			</Detail>

			<Address key="ADDR_OTHE" action="default">
				<Street></Street>
				<City></City>
				<State>${state}</State>
				<PostalCode></PostalCode>
				<County>${county}</County>
				<Country></Country>
				<CurrentOn>${formated_date}</CurrentOn>
			</Address>
		</Contact>
	</TeamConnectRequest>`;
}
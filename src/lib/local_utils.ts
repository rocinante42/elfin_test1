import type { City } from './types';

export function numberToWords(num: number): string {
	if (num < -100 || num > 100) {
		throw new Error('Number out of range. Only supports -100 to 100.');
	}

	const belowTwenty = [
		'zero',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'ten',
		'eleven',
		'twelve',
		'thirteen',
		'fourteen',
		'fifteen',
		'sixteen',
		'seventeen',
		'eighteen',
		'nineteen'
	];

	const tens = [
		'',
		'',
		'twenty',
		'thirty',
		'forty',
		'fifty',
		'sixty',
		'seventy',
		'eighty',
		'ninety'
	];

	if (num === 0) return 'zero';

	let words = '';

	if (num < 0) {
		words += 'minus ';
		num = Math.abs(num);
	}

	if (num < 20) {
		words += belowTwenty[num];
	} else {
		const tenPlace = Math.floor(num / 10);
		const unitPlace = num % 10;

		words += tens[tenPlace];
		if (unitPlace > 0) {
			words += ` ${belowTwenty[unitPlace]}`;
		}
	}

	return words.trim();
}

export function normalizeTemperature(temp: number, decimals = 1): string {
	return `${temp?.toFixed(decimals)}°`;
}

export function distributeCitiesInTwo(cities: City[]): [City[], City[]] {
	const citiesCopy = [...cities];
	const firstHalf = citiesCopy.splice(0, Math.ceil(citiesCopy.length / 2));
	return [firstHalf, citiesCopy];
}

export function getCountryEmoji(countryName: string): string | null {
	// Map of country names to ISO 3166-1 alpha-2 codes
	const countryToCode: { [key: string]: string } = {
		Afghanistan: 'AF',
		Albania: 'AL',
		Algeria: 'DZ',
		Andorra: 'AD',
		Angola: 'AO',
		Argentina: 'AR',
		Armenia: 'AM',
		Australia: 'AU',
		Austria: 'AT',
		Azerbaijan: 'AZ',
		Bahamas: 'BS',
		Bahrain: 'BH',
		Bangladesh: 'BD',
		Barbados: 'BB',
		Belarus: 'BY',
		Belgium: 'BE',
		Belize: 'BZ',
		Benin: 'BJ',
		Bhutan: 'BT',
		Bolivia: 'BO',
		Bosnia: 'BA',
		Botswana: 'BW',
		Brazil: 'BR',
		Brunei: 'BN',
		Bulgaria: 'BG',
		'Burkina Faso': 'BF',
		Burundi: 'BI',
		Cambodia: 'KH',
		Cameroon: 'CM',
		Canada: 'CA',
		Chad: 'TD',
		Chile: 'CL',
		China: 'CN',
		Colombia: 'CO',
		Comoros: 'KM',
		Congo: 'CG',
		Croatia: 'HR',
		Cuba: 'CU',
		Cyprus: 'CY',
		Czechia: 'CZ',
		Denmark: 'DK',
		Djibouti: 'DJ',
		Dominica: 'DM',
		'Dominican Republic': 'DO',
		Ecuador: 'EC',
		Egypt: 'EG',
		'El Salvador': 'SV',
		Estonia: 'EE',
		Eswatini: 'SZ',
		Ethiopia: 'ET',
		Fiji: 'FJ',
		Finland: 'FI',
		France: 'FR',
		Gabon: 'GA',
		Gambia: 'GM',
		Georgia: 'GE',
		Germany: 'DE',
		Ghana: 'GH',
		Greece: 'GR',
		Grenada: 'GD',
		Guatemala: 'GT',
		Guinea: 'GN',
		Guyana: 'GY',
		Haiti: 'HT',
		Honduras: 'HN',
		Hungary: 'HU',
		Iceland: 'IS',
		India: 'IN',
		Indonesia: 'ID',
		Iran: 'IR',
		Iraq: 'IQ',
		Ireland: 'IE',
		Israel: 'IL',
		Italy: 'IT',
		Jamaica: 'JM',
		Japan: 'JP',
		Jordan: 'JO',
		Kazakhstan: 'KZ',
		Kenya: 'KE',
		Kiribati: 'KI',
		Korea: 'KR',
		Kuwait: 'KW',
		Kyrgyzstan: 'KG',
		Laos: 'LA',
		Latvia: 'LV',
		Lebanon: 'LB',
		Lesotho: 'LS',
		Liberia: 'LR',
		Libya: 'LY',
		Liechtenstein: 'LI',
		Lithuania: 'LT',
		Luxembourg: 'LU',
		Madagascar: 'MG',
		Malawi: 'MW',
		Malaysia: 'MY',
		Maldives: 'MV',
		Mali: 'ML',
		Malta: 'MT',
		Mauritania: 'MR',
		Mauritius: 'MU',
		Mexico: 'MX',
		Moldova: 'MD',
		Monaco: 'MC',
		Mongolia: 'MN',
		Montenegro: 'ME',
		Morocco: 'MA',
		Mozambique: 'MZ',
		Myanmar: 'MM',
		Namibia: 'NA',
		Nauru: 'NR',
		Nepal: 'NP',
		Netherlands: 'NL',
		'New Zealand': 'NZ',
		Nicaragua: 'NI',
		Niger: 'NE',
		Nigeria: 'NG',
		'North Macedonia': 'MK',
		Norway: 'NO',
		Oman: 'OM',
		Pakistan: 'PK',
		Palau: 'PW',
		Panama: 'PA',
		Paraguay: 'PY',
		Peru: 'PE',
		Philippines: 'PH',
		Poland: 'PL',
		Portugal: 'PT',
		Qatar: 'QA',
		Romania: 'RO',
		Russia: 'RU',
		Rwanda: 'RW',
		'Saint Kitts and Nevis': 'KN',
		'Saint Lucia': 'LC',
		'Saint Vincent and the Grenadines': 'VC',
		Samoa: 'WS',
		'San Marino': 'SM',
		'Saudi Arabia': 'SA',
		Senegal: 'SN',
		Serbia: 'RS',
		Seychelles: 'SC',
		Singapore: 'SG',
		Slovakia: 'SK',
		Slovenia: 'SI',
		'Solomon Islands': 'SB',
		Somalia: 'SO',
		'South Africa': 'ZA',
		Spain: 'ES',
		Sudan: 'SD',
		Suriname: 'SR',
		Sweden: 'SE',
		Switzerland: 'CH',
		Syria: 'SY',
		Taiwan: 'TW',
		Tajikistan: 'TJ',
		Tanzania: 'TZ',
		Thailand: 'TH',
		Togo: 'TG',
		Tonga: 'TO',
		Tunisia: 'TN',
		Turkey: 'TR',
		Turkmenistan: 'TM',
		Tuvalu: 'TV',
		Uganda: 'UG',
		Ukraine: 'UA',
		'United Arab Emirates': 'AE',
		'United Kingdom': 'GB',
		'United States': 'US',
		Uruguay: 'UY',
		Uzbekistan: 'UZ',
		Vanuatu: 'VU',
		Venezuela: 'VE',
		Vietnam: 'VN',
		Yemen: 'YE',
		Zambia: 'ZM',
		Zimbabwe: 'ZW'
	};

	const countryCode = countryToCode[countryName.trim()];

	if (!countryCode) {
		return null; 
	}

	// Convert ISO code to flag emoji
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

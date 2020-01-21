// 1. pull players from footywire
// 2. convert csv -> json
// 3. convert team names
// 4. save to json file

const fs = require('fs')
const readLine = require('readline')

const pathToPlayersCSV = './data/players.csv'
const pathToPlayersJSON = './data/players.json'
const contentIndexes = {
	id: 1,
	firstname: 2,
	lastname: 3,
	team: 4,
	number: 6
}
const teamTranslation = {
  'Adelaide': 'ADELAIDE',
  'Brisbane Lions': 'BRISBANE',
  'Carlton': 'CARLTON',
  'Collingwood': 'COLLINGWOOD',
  'Essendon': 'ESSENDON',
  'Fremantle': 'FREMANTLE',
  'Gold Coast': 'GOLDCOAST',
  'Geelong': 'GEELONG',
  'Hawthorn': 'HAWTHORN',
  'Melbourne': 'MELBOURNE',
  'North Melbourne': 'NORTHMELBOURNE',
  'Port Adelaide': 'PORTADELAIDE',
  'Richmond': 'RICHMOND',
  'St Kilda': 'STKILDA',
  'Sydney': 'SYDNEY',
  'Western Bulldogs': 'WESTERNBULLDOGS',
  'West Coast': 'WESTCOAST',
  'GWS': 'GREATERWESTERNSYDNEY'
}

async function convertToJSON() {
	const players = []
	const idCheckSet = new Set()

	if (!fs.existsSync(pathToPlayersCSV)) {
		console.log('get players csv from http://www.fanfooty.com.au/resources.php')
	}

	const linereader = readLine.createInterface({
		input: fs.createReadStream(pathToPlayersCSV),
		crlfDelay: Infinity
	})

	for await (const line of linereader) {
		let stripped = ''
		for (let i = 0; i < line.length; i++) {
			if (line.charAt(i) != '"') {
				stripped = stripped + line.charAt(i)
			}
		}

		const elements = stripped.split(',')
		const player = {
			id: elements[contentIndexes.id],
			firstname: elements[contentIndexes.firstname],
			lastname: elements[contentIndexes.lastname],
			team: teamTranslation[elements[contentIndexes.team]],
			number: elements[contentIndexes.number]
		}
		players.push(player)

		if (idCheckSet.has(player.id)) {
			throw "ID repeated"
		} else {
			idCheckSet.add(player.id)			
		}
	}

	const asJson = JSON.stringify(players)
	fs.writeFile(pathToPlayersJSON, asJson, (error) => {
		if (error) {
			throw error
		} else {
			console.log('file written to', pathToPlayersJSON)
		}
	})
}

convertToJSON()
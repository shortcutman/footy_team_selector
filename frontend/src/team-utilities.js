import gql from 'graphql-tag'

const fullTeamQuery = gql`{
	currentTeam @client {
		FPOCK1 {
			id
			firstname
			lastname
			number
			team
		}
		FULLF {
			id
			firstname
			lastname
			number
			team
		}
		FPOCK2 {
			id
			firstname
			lastname
			number
			team
		}
		FFLNK1 {
			id
			firstname
			lastname
			number
			team
		}
		HALFF {
			id
			firstname
			lastname
			number
			team
		}
		FFLNK2 {
			id
			firstname
			lastname
			number
			team
		}
		WING1 {
			id
			firstname
			lastname
			number
			team
		}
		CENTRE {
			id
			firstname
			lastname
			number
			team
		}
		WING2 {
			id
			firstname
			lastname
			number
			team
		}
		BFLNK1 {
			id
			firstname
			lastname
			number
			team
		}
		HALFB {
			id
			firstname
			lastname
			number
			team
		}
		BFLNK2 {
			id
			firstname
			lastname
			number
			team
		}
		BPOCK1 {
			id
			firstname
			lastname
			number
			team
		}
		FULLB {
			id
			firstname
			lastname
			number
			team
		}
		BPOCK2 {
			id
			firstname
			lastname
			number
			team
		}
		RUCK {
			id
			firstname
			lastname
			number
			team
		}
		ROVER {
			id
			firstname
			lastname
			number
			team
		}
		RKRVR {
			id
			firstname
			lastname
			number
			team
		}
		INT1 {
			id
			firstname
			lastname
			number
			team
		}
		INT2 {
			id
			firstname
			lastname
			number
			team
		}
		INT3 {
			id
			firstname
			lastname
			number
			team
		}
		INT4 {
			id
			firstname
			lastname
			number
			team
		}
	}
}`

function emptyTeam() {
	return {
		"FPOCK1": null,
		"FULLF": null,
		"FPOCK2": null,
		"FFLNK1": null,
		"HALFF": null,
		"FFLNK2": null,
		"WING1": null,
		"CENTRE": null,
		"WING2": null,
		"BFLNK1": null,
		"HALFB": null,
		"BFLNK2": null,
		"BPOCK1": null,
		"FULLB": null,
		"BPOCK2": null,
		"RUCK": null,
		"ROVER": null,
		"RKRVR": null,
		"INT1": null,
		"INT2": null,
		"INT3": null,
		"INT4": null,
		"__typename": "Team"
	}
}

function teamLength(team) {
	return Object.keys(team).reduce((accum, position) => {
		if (position !== '__typename' && team[position] !== null) {
			return accum +1
		} else {
			return accum
		}
	}, 0)
}

export default {
	fullTeamQuery,
	emptyTeam,
	teamLength
}
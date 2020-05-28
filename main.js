// Require library
var excel = require('excel4node');



const { Client } = require('espn-fantasy-football-api/node');
const myClient = new Client({ leagueId: 1040553 });

myClient.setCookies({ espnS2: 'AECRI491LPVfov%2Fx%2BfWAcq%2Br6%2B4rUHlid62h%2BDmA3ReTT4ZAHCpUtokQJxK9JBtkzJibArDvfWaop2%2FiyOyURAWu2OHRfoo4SiYfp7YEu6TrVZhmQBksLHIJyBVMKM9oRN7dePY%2FjSa2DM2wqYzBEbl5iD1pTbO8t6BBgLAAkOm3jUh%2BSDz7OAugOGdfCkLrt24ImJfgZ8hHWjGqSIDC%2BqMSXnh7BRezgsBiJrjR6LMFx3c9kTE1%2B9GGtJPXqe%2BsuFqfUirJdYaqSJoiSewgF6sb', SWID: '{954F9EE7-8CE7-4DEA-BB7B-3B09AF22577B}' });

//console.log("Get League Info");
//myClient.getLeagueInfo({seasonId: 2019}).then(console.log)

var years = [2018, 2019]

var promises = [];
years.forEach( year => {
    promises.push(myClient.getTeamsAtWeek({seasonId: year, scoringPeriodId: 1}))
    promises.push(myClient.getTeamsAtWeek({seasonId: year, scoringPeriodId: 18}))
})

Promise.all(promises).then(function(values) {

    var workbook = new excel.Workbook();
    var teamWorksheets = {}

    var col = 1
    values.forEach(function(teams){
        var row = 1
        //console.log(teams);
        teams.forEach(team => {
            if (!(team.id in teamWorksheets)) {
                teamWorksheets[team.id] = workbook.addWorksheet(team.name);
            }
            row = 1
            if (col % 2) {
                teamWorksheets[team.id].cell(row,col).string(team.seasonId + " Start")
            } else {
                teamWorksheets[team.id].cell(row,col).string(team.seasonId + " End")
            }
            row += 1
            var roster = team.roster
            roster.forEach(player => {
                console.log("   " + player.fullName)
                teamWorksheets[team.id].cell(row,col).string(player.fullName)
                row += 1
            })
        });
        col = col + 1
    })

    workbook.write('TheMastersFFL.xlsx');
})
.catch ( (err) => console.log(err))



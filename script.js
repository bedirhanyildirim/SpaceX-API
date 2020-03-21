document.getElementById("nextButton").addEventListener("click", () => {
    document.getElementsByClassName("next-container")[0].style.display = "inherit"
    document.getElementsByClassName("past-container")[0].style.display = "none"
    document.getElementById("pastButton").classList.remove("active")
    document.getElementById("nextButton").classList.add("active")
})

document.getElementById("pastButton").addEventListener("click", () => {
    document.getElementsByClassName("next-container")[0].style.display = "none"
    document.getElementsByClassName("past-container")[0].style.display = "inherit"
    document.getElementById("nextButton").classList.remove("active")
    document.getElementById("pastButton").classList.add("active")
    readPastLaunch()
})

readSpaceXData()

var nextLaunch = {
    "site_name": "",
    "rocket_name": "",
    "mission_name": "",
    "flight_number": 0,
    "launch_date_unix": 0
}

var pastLaunch = {
    "site_name": "",
    "rocket_name": "",
    "mission_name": "",
    "flight_number": 0,
    "launch_date_unix": 0
}

function readPastLaunch() {
    fetch("https://api.spacexdata.com/v3/launches/latest")
        .then(res => res.json())
        .then(fillPastAreas)
}

function fillPastAreas(data) {
    // fill object
    pastLaunch.flight_number = data.flight_number
    pastLaunch.mission_name = data.mission_name
    pastLaunch.rocket_name = data.rocket.rocket_name
    pastLaunch.site_name = data.launch_site.site_name
    pastLaunch.launch_date_unix = data.launch_date_unix

    //fill ui
    document.getElementById("PastFlightNumber").innerText = pastLaunch.flight_number
    document.getElementById("PastMissionName").innerText = pastLaunch.mission_name
    document.getElementById("PastRocketName").innerText = pastLaunch.rocket_name
    document.getElementById("PastLaunchSiteName").innerText = pastLaunch.site_name

    //calculate date
    console.log("****************************************")
    var date = new Date(pastLaunch.launch_date_unix * 1000)
    document.getElementById("launchedDate").innerText = date.toString()
    console.log("****************************************")
}

function readSpaceXData() {
    fetch("https://api.spacexdata.com/v3/launches/upcoming")
        .then(res => res.json())
        .then(checkIfItIsOk)
        .then(fillAreas)
        .then(countDown)
}

function checkIfItIsOk(data) {

    for (let el of data) {
        let ctrl = dateChecker(el.launch_date_unix)
        console.log(el)
        if (ctrl) {
            nextLaunch.flight_number = el.flight_number
            nextLaunch.mission_name = el.mission_name
            nextLaunch.rocket_name = el.rocket.rocket_name
            nextLaunch.site_name = el.launch_site.site_name
            nextLaunch.launch_date_unix = el.launch_date_unix
            break
        }
    }
}

function dateChecker(date) {
    var now = Date.now() / 1000 | 0
    if (date - now < 0) {
        return false
    }
    return true
}

function fillAreas() {
    document.getElementById("FlightNumber").innerText = nextLaunch.flight_number
    document.getElementById("MissionName").innerText = nextLaunch.mission_name
    document.getElementById("RocketName").innerText = nextLaunch.rocket_name
    document.getElementById("LaunchSiteName").innerText = nextLaunch.site_name
}

function countDown() {
    setInterval(function () {
        var now = Date.now() / 1000 | 0
        var fark = nextLaunch.launch_date_unix - now

        var day = Math.floor((fark) / 60 / 60 / 24)
        document.getElementById("days").innerText = day
        fark = fark - day * 60 * 60 * 24

        var hours = Math.floor((fark) / 60 / 60)
        document.getElementById("hours").innerText = hours
        fark = fark - hours * 60 * 60

        var minutes = Math.floor((fark) / 60)
        document.getElementById("minutes").innerText = minutes
        fark = fark - minutes * 60

        var seconds = Math.floor(fark)
        document.getElementById("seconds").innerText = seconds
    }, 1000)
}
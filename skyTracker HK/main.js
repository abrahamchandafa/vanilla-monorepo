// DATA
let iata = [];

const fetchIata = async () => {
    try {
        const res = await fetch("./iata.json");
        if (!res.ok) throw new Error("Failed to fetch iata.json");
        iata = await res.json();
    } catch (e) {
        console.error("Error fetching iata.json (goto line 10 of main.js)");
    }
}



const monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

// DATE RENDERING
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let date = today.getDate();
let dateToString = `${year}-${month+1}-${date}`; // YYYY-MM-DD
let dateRender = document.querySelector("#date-render");
let dateString = `Date: ${monthNames[month]} ${date}, ${year}`;
dateRender.textContent = dateString;



let departures = []
let arrivals = []


const flightToggler = function(arrival=false) {

    let t = new Date();
    let now = `${t.getHours()}:${t.getMinutes()}`;
    let counter = 0;

    let fcDiv = document.getElementById("flight-content");
    fcDiv.innerHTML = "";

    if (arrival){
        document.getElementById("arrival").style.textDecoration = "underline";
        document.getElementById("departure").style.textDecoration = "none";
        document.getElementById("mini-header").textContent = "Arrival Information";
        
        // displaying next ten flights
        for (let i of arrivals) {
            if (counter < 10) {
                if (i.scheduledTime.length === 5 && i.scheduledTime >= now) { // only pick those of today
                    let myDiv = document.createElement("div");
                    let myOrigin = document.createElement("p");
                    myOrigin.innerHTML = "<b>Origin (Airport):</b>";
                    myDiv.append(myOrigin);

                    i.origin.forEach(d => {
                        let myIataInfo = document.createElement("p");
                        myIataInfo.textContent = d;
                        myDiv.append(myIataInfo);
                    });

                    let flightNo = document.createElement("p");
                    flightNo.innerHTML = `<b>Flight No.: </b>${i.flightNo}`;
                    myDiv.append(flightNo);

                    let scheduledTime = document.createElement("p");
                    scheduledTime.innerHTML = `<b>Scheduled Time: </b>${i.scheduledTime}`;
                    myDiv.append(scheduledTime);

                    let secondLast = document.createElement("div");

                    let parkingStand = document.createElement("span");
                    parkingStand.innerHTML = `<b>Parking Stand: </b>${i.parkingStand}    `;
                    secondLast.append(parkingStand);

                    let hall = document.createElement("span");
                    hall.innerHTML = `<b>Hall: </b>${i.hall}    `;
                    secondLast.append(hall);

                    let belt = document.createElement("span");
                    belt.innerHTML = `<b>Belt: </b>${i.belt}    `;
                    secondLast.append(belt);

                    let status = document.createElement("p");
                    status.innerHTML = `<b>Status: </b>${i.status}    `;
                    secondLast.append(status);
                    
                    secondLast.className="last-last";
                    myDiv.append(secondLast);

                    fcDiv.append(myDiv);
                    counter += 1;
                }

                
            } else {
                break;
            }
        }

    } else {
        document.getElementById("arrival").style.textDecoration = "none";
        document.getElementById("departure").style.textDecoration = "underline";
        document.getElementById("mini-header").textContent = "Departure Information";
        
        // displaying next ten flights
        for (let i of departures) {
            if (counter < 10) {
                if (i.scheduledTime.length === 5 && i.scheduledTime >= now) { // only pick those of today
                    let myDiv = document.createElement("div");
                    let myDestination = document.createElement("p");
                    myDestination.innerHTML = "<b>Destination (Airport):</b>";
                    myDiv.append(myDestination);

                    i.destination.forEach(d => {
                        let myIataInfo = document.createElement("p");
                        myIataInfo.textContent = d;
                        myDiv.append(myIataInfo);
                    });

                    let flightNo = document.createElement("p");
                    flightNo.innerHTML = `<b>Flight No.: </b>${i.flightNo}`;
                    myDiv.append(flightNo);

                    let scheduledTime = document.createElement("p");
                    scheduledTime.innerHTML = `<b>Scheduled Time: </b>${i.scheduledTime}`;
                    myDiv.append(scheduledTime);

                    let secondLast = document.createElement("div");

                    let terminal = document.createElement("span");
                    terminal.innerHTML = `<b>Terminal: </b>${i.terminal}    `;
                    secondLast.append(terminal);

                    let aisle = document.createElement("span");
                    aisle.innerHTML = `<b>Aisle: </b>${i.aisle}    `;
                    secondLast.append(aisle);

                    let gate = document.createElement("span");
                    gate.innerHTML = `<b>Gate: </b>${i.gate}    `;
                    secondLast.append(gate);

                    let status = document.createElement("p");
                    status.innerHTML = `<b>Status: </b>${i.status}    `;
                    secondLast.append(status);
                    
                    secondLast.className = "last-last";
                    myDiv.append(secondLast);


                    fcDiv.append(myDiv);
                    counter += 1;
                }               
            } else {
                break;
            }
        }

    }
    document.getElementById("mh-info").textContent = "(Next Ten Flights)";
    document.getElementById("search-text").value = "";

    
    let hideous = document.querySelectorAll('.flight-content > div');
    hideous.forEach(h => {
        h.addEventListener('click', hideUnhide, true);
    });


}



//  TOGGLE EFFECTS
const toggleCheck = function(event) {
    if (event.target.checked) {
        flightToggler(true);
    } else {
        flightToggler(false);
    }
}
let flightToggle = document.getElementById("flight-toggle");
flightToggle.addEventListener('change', toggleCheck);

//SEARCH AND RESET
const searchReset = function(event, text, toggleState) {
    let userInput = document.getElementById("search-text");
    
    if (event.target.id === "btn-reset") {
        userInput.value = "";
        userInput.placeholder = "";
        flightToggler(toggleState);
    } 
    else if (event.target.id === "btn-search") {
        if (!text.trim()) {
            userInput.value = "";
            userInput.placeholder = "enter location/airport!";
        }
        else {

            let fcDiv = document.getElementById("flight-content");
            fcDiv.innerHTML = "";

            if (toggleState) { // we're searching arrivals
                
                let result = arrivals.filter(i => i.origin.some(x => x.toLowerCase().includes(text.trim().toLowerCase())));
                if (result.length) {
                    for (let i of result) {
                        let myDiv = document.createElement("div");
                        let myOrigin = document.createElement("p");
                        myOrigin.innerHTML = "<b>Origin (Airport):</b>";
                        myDiv.append(myOrigin);

                        i.origin.forEach(d => {
                            let myIataInfo = document.createElement("p");
                            myIataInfo.textContent = d;
                            myDiv.append(myIataInfo);
                        });

                        let flightNo = document.createElement("p");
                        flightNo.innerHTML = `<b>Flight No.: </b>${i.flightNo}`;
                        myDiv.append(flightNo);

                        let scheduledTime = document.createElement("p");
                        scheduledTime.innerHTML = `<b>Scheduled Time: </b>${i.scheduledTime}`;
                        myDiv.append(scheduledTime);

                        let secondLast = document.createElement("div");

                        let parkingStand = document.createElement("span");
                        parkingStand.innerHTML = `<b>Parking Stand: </b>${i.parkingStand}    `;
                        secondLast.append(parkingStand);

                        let hall = document.createElement("span");
                        hall.innerHTML = `<b>Hall: </b>${i.hall}    `;
                        secondLast.append(hall);

                        let belt = document.createElement("span");
                        belt.innerHTML = `<b>Belt: </b>${i.belt}    `;
                        secondLast.append(belt);

                        let status = document.createElement("p");
                        status.innerHTML = `<b>Status: </b>${i.status}    `;
                        secondLast.append(status);

                        secondLast.className="last-last";
                        myDiv.append(secondLast);

                        fcDiv.append(myDiv);
                
                    }
                }  else {
                    let p = document.createElement("p");
                    p.innerHTML = "<p>NO RESULTS FOUND :(</p>";
                    fcDiv.append(p);           
                }

            } else { // we're searching departures
                
                let result = departures.filter(i => i.destination.some(x => x.toLowerCase().includes(text.trim().toLowerCase())));
                if (result.length) {
                    for (let i of result) {
                        let myDiv = document.createElement("div");
                        let myDestination = document.createElement("p");
                        myDestination.innerHTML = "<b>Destination (Airport):</b>";
                        myDiv.append(myDestination);

                        i.destination.forEach(d => {
                            let myIataInfo = document.createElement("p");
                            myIataInfo.textContent = d;
                            myDiv.append(myIataInfo);
                        });

                        let flightNo = document.createElement("p");
                        flightNo.innerHTML = `<b>Flight No.: </b>${i.flightNo}`;
                        myDiv.append(flightNo);

                        let scheduledTime = document.createElement("p");
                        scheduledTime.innerHTML = `<b>Scheduled Time: </b>${i.scheduledTime}`;
                        myDiv.append(scheduledTime);

                        let secondLast = document.createElement("div");

                        let terminal = document.createElement("span");
                        terminal.innerHTML = `<b>Terminal: </b>${i.terminal}    `;
                        secondLast.append(terminal);

                        let aisle = document.createElement("span");
                        aisle.innerHTML = `<b>Aisle: </b>${i.aisle}    `;
                        secondLast.append(aisle);

                        let gate = document.createElement("span");
                        gate.innerHTML = `<b>Gate: </b>${i.gate}    `;
                        secondLast.append(gate);


                        let status = document.createElement("p");
                        status.innerHTML = `<b>Status: </b>${i.status}    `;
                        secondLast.append(status);
                        
                        secondLast.className = "last-last";                       
                        myDiv.append(secondLast);

                        fcDiv.append(myDiv);

                    }
                } else {
                    let p = document.createElement("p");
                    p.innerHTML = "<p>NO RESULTS FOUND :(</p>";
                    fcDiv.append(p); 
                }

            }
            document.getElementById("mh-info").textContent = `(Search: ${text})`;

            let hideous = document.querySelectorAll('.flight-content > div');
            hideous.forEach(h => {
                h.addEventListener('click', hideUnhide, true);
            });

        }
    }


}
let btnReset = document.getElementById("btn-reset");
let btnSearch = document.getElementById("btn-search");
let searchText = document.getElementById("search-text");
; //true for arrival, false for departure
btnReset.addEventListener('click', function(event) {
    searchReset(event, searchText.value, document.getElementById("flight-toggle").checked);
})
btnSearch.addEventListener('click', function(event) {
    searchReset(event, searchText.value, document.getElementById("flight-toggle").checked);
})




// FETCH
const fetchRequest = async function (arrival=false) {
    await fetchIata();

    let myUrl = `flight.php?date=${year}-${month+1}-${date}&lang=en&cargo=false&arrival=${arrival? "true" : "false"}`
    fetch(myUrl)
    .then(response => {
        if (response.status == 200){
            response.json().then( data => {

                data.forEach(entry => {
                
                    let {arrival: isArrival, date: schedDate, list} = entry;
                    if (!isArrival) {  // DEPARTURES
                        list.forEach(flight => {
                            let destination = []
                            flight.destination.forEach(i => {
                                let a = iata.find(m => m.iata_code === i);
                                if (a) {
                                    destination.push(`${a.municipality} (${a.name})`);
                                }
                            
                            });
                            let flightNo = flight.flight.map(f => f.no).join("    ");
                            let scheduledTime = (dateToString === schedDate) ? flight.time : schedDate +" " + flight.time;
                            let gate = flight?.gate ?? "";
                            let terminal = flight?.terminal ?? "";
                            let aisle = flight?.aisle ?? "";
                            let status = flight.status ?? "";
                            let departure_item = {
                                destination,
                                flightNo,
                                scheduledTime,
                                gate,
                                terminal,
                                aisle,
                                status
                            }
                            departures.push(departure_item);
                        })                 
                    } else { // ARRIVALS
                        list.forEach(flight => {
                            let origin = []
                            flight.origin.forEach(i => {
                                let a = iata.find(m => m.iata_code === i);
                                if (a) {
                                    origin.push(`${a.municipality} (${a.name})`);
                                }
                            
                            });
                            let flightNo = flight.flight.map(f => f.no).join("    ");
                            let scheduledTime = dateToString === schedDate ? flight.time : schedDate +" " + flight.time;
                            let parkingStand = flight?.stand ?? "";
                            let hall = flight?.hall ?? "";
                            let belt = flight?.baggage ?? "";
                            let status = flight?.status ?? "";
                            let arrival_item = {
                                origin,
                                flightNo,
                                scheduledTime,
                                parkingStand,
                                hall,
                                belt,
                                status
                            }
                            arrivals.push(arrival_item);
                        })  

                    }
                })
                flightToggler(false);
            })
        } else {
            console.log("HTTP return status during FETCH: " + response.status);
        }
    })
    .catch( err => {
        console.log("Fetch error");
        throw new Error("Fetch Error");
    })
}



// HIDE, UNHIDE ON CLICK FOR SMALL SCREENS
const hideUnhide = function(event) {

    if (window.innerWidth <= 500) {

        let clicked = event.currentTarget;
        
        let lastLast = clicked.querySelector('.last-last');
        
        let computedStyle = window.getComputedStyle(lastLast);
        let display = computedStyle.display;

        if (display === "none"){
            lastLast.style.display = "block";
        } else {
            lastLast.style.display = "none";
        }          
        
    }
}

// UNHIDE ALL AFTER WIDTH >500
const resetLastLastDisplay = () => {
    if (window.innerWidth > 500) {
        let lastLast = document.querySelectorAll('.last-last');
        lastLast.forEach(element => {
            element.style.display = 'block';
        });
    } else {
        let lastLast = document.querySelectorAll('.last-last');
        lastLast.forEach(element => {
            element.style.display = 'none';
        });
    }
};
window.addEventListener('resize', resetLastLastDisplay);



// RELOAD
const onReload = function() {
    location.reload(true);
}
document.getElementById("reload").addEventListener('click', onReload);


// ONLOAD
window.onload = (e) => {
    fetchRequest(false);
    fetchRequest(true);
}
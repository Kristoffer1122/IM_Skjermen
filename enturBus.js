async function fetchDepartures() {
  const url = "https://api.entur.io/journey-planner/v3/graphql";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ET-Client-Name": "Infoboard-app",
      },
      body: JSON.stringify({
        query: `
          {
            stopPlace(id: "NSR:StopPlace:6435") {
              id
              name
              estimatedCalls(timeRange: 72100, numberOfDepartures: 12) {
                realtime
                aimedArrivalTime
                expectedArrivalTime
                destinationDisplay {
                  frontText
                }
                serviceJourney {
                  journeyPattern {
                    line {
                      id
                      transportMode
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Response ${response.status}`);
    }

    departuresData = await response.json();
    showDepartures()
    // console.dir(departuresData.data.stopPlace, { depth: null });
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}



setInterval(fetchDepartures, 30000);
fetchDepartures()

function showDepartures() {

  let sentrumDepartures = []
  let otherWayDepartures = []

  const sentrum = ["Kværnerbyen", "Ekeberg hageby"]
  const otherWay = ["Kjelsås stasjon", "Tåsen"]

  const container = document.getElementById("departures");
  const calls = departuresData.data.stopPlace.estimatedCalls

  container.innerHTML = "";
  for (let call of calls) {
  // let aimedArrival = call.aimedArrivalTime; 
  // will be used to show how late a bus is  
    let expectedArrival = new Date(call.expectedArrivalTime);
    let now = new Date()
    let timeDiff = Math.floor((expectedArrival - now) / 1000 / 60) 

    let frontText = call.destinationDisplay.frontText;
    let lineId = call.serviceJourney.journeyPattern.line.id.split(":").pop()

    if (sentrum.includes(frontText)) {
      sentrumDepartures.push(call)
      console.log("pushed", frontText, "to sentrumDepartures")
    } else {
      otherWayDepartures.push(call)
      console.log("pushed", frontText, "to otherWayDepartures")
    }

    const div = document.createElement("div");
    div.classList.add("departures");
    div.innerHTML = `
      <span class="line">${lineId} ${frontText}</span>
      <span class="time">${timeDiff <= 0 ? "nå" : timeDiff + " min"}</span>
    `;
    container.appendChild(div);
  
    
    // console.log(`${lineId} ${frontText}: ${timeDiff}`)
    }
    //console.log("-------------------------")
    //console.log("sentrum:", sentrumDepartures);
    //console.log("otherWay", otherWayDepartures)
    //console.log("-------------------------")

    }


setInterval(showDepartures, 9000);



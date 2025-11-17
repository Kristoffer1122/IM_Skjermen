<<<<<<< HEAD
let DeparturesData = null;

async function FetchDepartures() {
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
                            destinationDisplay { frontText }
                            serviceJourney {
                                journeyPattern {
                                    line { id transportMode }
                                }
                            }
                        }
                    }
                }
<<<<<<< HEAD
                `,
			}),
		});
		if (!response.ok) throw new Error(`Response ${response.status}`);
		DeparturesData = await response.json();
		ShowDepartures();
	} catch (error) {
		console.error("Fetch error:", error.message);
	}
}

function ShowDepartures() {
	if (!DeparturesData || !DeparturesData.data || !DeparturesData.data.stopPlace) {
		document.getElementById("departures").innerHTML = "<span>Ingen avganger</span>";
		return;
	}

	// Grouping for each direction
	const Sentrum = ["Kværnerbyen", "Ekeberg hageby"];
	const Vest = ["Kjelsås stasjon", "Tåsen"];

	const Calls = DeparturesData.data.stopPlace.estimatedCalls;
	const SentrumDepartures = [];
	const VestDepartures = [];

	for (let Call of Calls) {
		const Destination = Call.destinationDisplay.frontText;
		if (Sentrum.includes(Destination)) {
			SentrumDepartures.push(Call);
		} else if (Vest.includes(Destination)) {
			VestDepartures.push(Call);
		}
	}

	// Render vertically: Sentrum row above, Vest row below
	const Container = document.getElementById("departures");
	Container.innerHTML = `
        <div class="departures-row" id="sentrum-row">
            <div class="direction-header">Retning Sentrum</div>
            <div class="departures-list" id="sentrum-list"></div>
        </div>
        <div class="departures-row" id="vest-row">
            <div class="direction-header">Retning Vest</div>
            <div class="departures-list" id="vest-list"></div>
        </div>
    `;

	// Helper to render a bus departure
	function renderDeparture(Call) {
		const ExpectedArrival = new Date(Call.expectedArrivalTime);
		const Now = new Date();
		const TimeDiff = Math.floor((ExpectedArrival - Now) / 1000 / 60);
		const Destination = Call.destinationDisplay.frontText;
		const LineId = Call.serviceJourney.journeyPattern.line.id.split(":").pop();
		const Div = document.createElement("div");
		Div.classList.add("departure");
		Div.innerHTML = `
            <span class="bus-line">${LineId}</span>
            <span class="bus-direction">${Destination}</span>
            <span class="bus-time">${TimeDiff <= 0 ? "nå" : TimeDiff + " min"}</span>
        `;
		return Div;
	}

	// Populate Sentrum row
	const SentrumList = Container.querySelector("#sentrum-list");
	if (SentrumDepartures.length > 0) {
		SentrumDepartures.forEach(Call => {
			SentrumList.appendChild(renderDeparture(Call));
		});
	} else {
		const Empty = document.createElement("div");
		Empty.className = "empty-message";
		Empty.textContent = "Ingen avganger";
		SentrumList.appendChild(Empty);
	}

	// Populate Vest row
	const VestList = Container.querySelector("#vest-list");
	if (VestDepartures.length > 0) {
		VestDepartures.forEach(Call => {
			VestList.appendChild(renderDeparture(Call));
		});
	} else {
		const Empty = document.createElement("div");
		Empty.className = "empty-message";
		Empty.textContent = "Ingen avganger";
		VestList.appendChild(Empty);
	}
}

// Initial and periodic updates every 30 seconds
setInterval(FetchDepartures, 30000);
FetchDepartures();
=======
=======
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
>>>>>>> 67be9eb95b6a831c35555cc00996b340b1b8d9e9
              }
            }
          }
        `,
      }),
    });

<<<<<<< HEAD
    if (!response.ok) throw new Error(`Response ${response.status}`);

    departuresData = await response.json();
    showDepartures();
=======
    if (!response.ok) {
      throw new Error(`Response ${response.status}`);
    }

    departuresData = await response.json();
    showDepartures()
    // console.dir(departuresData.data.stopPlace, { depth: null });
>>>>>>> 67be9eb95b6a831c35555cc00996b340b1b8d9e9
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

<<<<<<< HEAD
function formatDepartureTime(expectedArrival) {
  const now = new Date();
  const timeDiff = Math.floor((expectedArrival - now) / 1000 / 60);

  if (timeDiff <= 0) return "Nå";
  if (timeDiff <= 15) return timeDiff + " min";

  return expectedArrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showDepartures() {
  const sentrum = ["Kværnerbyen", "Ekeberg hageby"];
  const otherWay = ["Kjelsås stasjon", "Tåsen"];

  const calls = departuresData.data?.stopPlace?.estimatedCalls || [];
  const containerSentrum = document.getElementById("departuresSentrum");
  const containerOtherWay = document.getElementById("departuresOtherWay");

  containerSentrum.innerHTML = "";
  containerOtherWay.innerHTML = "";

  for (let call of calls) {
    const frontText = call.destinationDisplay.frontText;
    const lineId = call.serviceJourney.journeyPattern.line.id.split(":").pop();
    const expectedArrival = new Date(call.expectedArrivalTime);

    const div = document.createElement("div");
    div.classList.add("departures");
    div.innerHTML = `
      <div class="lineBox">
        <span class="lineNumber">${lineId}</span>
        <span class="lineName">${frontText}</span>
      </div>
      <span class="departureTime">${formatDepartureTime(expectedArrival)}</span>
    `;

    if (sentrum.includes(frontText)) containerSentrum.appendChild(div);
    else if (otherWay.includes(frontText)) containerOtherWay.appendChild(div);
  }
}

setInterval(fetchDepartures, 30000);
fetchDepartures();
setInterval(showDepartures, 9000);
>>>>>>> d281fd67f0d513559700abde6c50134da8d3679c
=======


setInterval(fetchDepartures, 30000);
fetchDepartures()

function showDepartures() {

  let sentrumDepartures = []
  let otherWayDepartures = []

  const sentrum = ["Kværnerbyen", "Ekeberg hageby"]
  const otherWay = ["Kjelsås stasjon", "Tåsen"]

  const calls = departuresData.data.stopPlace.estimatedCalls

  const containerOtherWay = document.getElementById("departuresOtherWay");
  const containerSentrum = document.getElementById("departuresSentrum")

  containerOtherWay.innerHTML = "";
  containerSentrum.innerHTML = "";

  //ts pmo
  for (let call of calls) {
    frontText = call.destinationDisplay.frontText
    if (sentrum.includes(frontText)) {
      sentrumDepartures.push(call)
    } else if (otherWay.includes(frontText)){
      otherWayDepartures.push(call)
    }
  }

  for (let sentrumDeparture of sentrumDepartures) {
    let sentrumFrontText = sentrumDeparture.destinationDisplay.frontText
    let sentrumLineId = sentrumDeparture.serviceJourney.journeyPattern.line.id.split(":").pop()
    let sentrumExpectedArrival = new Date(sentrumDeparture.expectedArrivalTime)
    let now = new Date()
    let sentrumTimeDiff = Math.floor((sentrumExpectedArrival - now ) / 1000 / 60)

    const sentrumDiv = document.createElement("div");
    sentrumDiv.classList.add("departures");
    sentrumDiv.innerHTML = `
      <span class="sentrumLine">${sentrumLineId} ${sentrumFrontText}</span>
      <span class="time">${sentrumTimeDiff <= 0 ? "nå" : sentrumTimeDiff + " min"}</span>
    `;
    containerSentrum.appendChild(sentrumDiv);
  }

  for (let otherWayDeparture of otherWayDepartures) {
    let otherWayFrontText = otherWayDeparture.destinationDisplay.frontText
    let otherWaylineId = otherWayDeparture.serviceJourney.journeyPattern.line.id.split(":").pop()
    let otherWayExpectedArrival = new Date(otherWayDeparture.expectedArrivalTime)
    now = new Date()
    let otherWayTimeDiff = Math.floor((otherWayExpectedArrival - now) / 1000 / 60 )

    const otherWayDiv = document.createElement("div");
    otherWayDiv.classList.add("departures");
    otherWayDiv.innerHTML = `
      <span class="otherWayLine">${otherWaylineId} ${otherWayFrontText}</span>
      <span class="time">${otherWayTimeDiff <= 0 ? "nå" : otherWayTimeDiff + " min" }</span>
    `;
    containerOtherWay.appendChild(otherWayDiv)
  }
}

setInterval(showDepartures, 9000);


>>>>>>> 67be9eb95b6a831c35555cc00996b340b1b8d9e9

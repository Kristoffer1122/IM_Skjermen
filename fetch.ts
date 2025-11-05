const query = `
{
  stopPlace(id: "NSR:StopPlace:6435") {
    id
    name
    estimatedCalls(timeRange: 72100, numberOfDepartures: 10) {
      realtime
      aimedArrivalTime
      expectedArrivalTime
      destinationDisplay { frontText }
      quay { id }
      serviceJourney {
        journeyPattern {
          line { id name transportMode }
        }
      }
    }
  }
}
`;

const url = "https://api.entur.io/journey-planner/v3/graphql";

const getData = async () => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"ET-Client-Name": "elvebakken-infoskjerm"
		},
		body: JSON.stringify({ query })
	});

	const text = await response.text(); // log raw body if parsing fails
	try {
		const data = JSON.parse(text);
		busRoutes(data);
	} catch (err) {
		console.error("Failed to parse JSON:", text);
	}
}


const busRoutes = async (data: any) => {

	const busLines: {
		lineName: string,
		destination: string,
		aimedArrivalTime: string,
		expectedArrivalTime: string,
		realtime: boolean
	} = data.data.stopPlace.estimatedCalls.map(call => ({
		lineName: call.serviceJourney.journeyPattern.line.name,
		destination: call.destinationDisplay.frontText,
		aimedArrivalTime: call.aimedArrivalTime,
		expectedArrivalTime: call.expectedArrivalTime,
		realtime: call.realtime
	}));

	console.log(busLines);

	return busLines;

}

getData();


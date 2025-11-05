import requests
import json
from datetime import datetime
from typing import List, Dict, Any

query = """
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
"""

url = "https://api.entur.io/journey-planner/v3/graphql"

def get_data():
    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "ET-Client-Name": "elvebakken-infoskjerm"
        },
        json={"query": query}
    )
    
    try:
        data = response.json()
        bus_routes(data)
    except json.JSONDecodeError as err:
        print(f"Failed to parse JSON: {response.text}")

def bus_routes(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    bus_lines = []
    
    for call in data['data']['stopPlace']['estimatedCalls']:
        bus_lines.append({
            'lineName': call['serviceJourney']['journeyPattern']['line']['name'],
            'destination': call['destinationDisplay']['frontText'],
            'aimedArrivalTime': call['aimedArrivalTime'],
            'expectedArrivalTime': call['expectedArrivalTime'],
            'realtime': call['realtime']
        })
    
    print(bus_lines)
    return bus_lines

if __name__ == "__main__":
    get_data()

import axios from "axios";

//export the pickup points query for use in the map component
const GET_PICKUP_POINTS = `
query Points($first: Int!, $sessionId: ID!, $sortBy: PickupPointSortInput, $location: LocationInput!) {
  session(id: $sessionId) {
    pickupPoint {
      pickupPoints(sortBy: $sortBy) {
        points(first: $first) {
          data {
            address {
              addressLine1
              city
              postalCode
            }
            location {
              latitude
              longitude
            }
            operator {
              name
            }
            distance(location: $location)
            icon
          }
        }
      }
    }
  }
}`;

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/api/pickup-points";

export async function getPickupPoints(lat: number, lng: number, sessionId: string) {
  //Make a POST request to the GraphQL endpoint with the query and variables

  console.log("Fetching pickup points for location:", { lat, lng, sessionId });
  const response = await axios.post(API_URL, {
    query: GET_PICKUP_POINTS,
    variables: {
      "sessionId": sessionId,
      "first": 5,
      "sortBy": {
        "location": {
          "latitude": 47.239635,
          "longitude": 18.29724
        },
        "field": "DISTANCE"
      },
      "location": {
        "latitude": 47.239635,
        "longitude": 18.29724
      }
    }
  });

  console.log("GraphQL response:", response.data);

  if (response.data.errors) {
    console.error("GraphQL errors:", response.data.errors);
    throw new Error(response.data.errors[0].message || "Unknown error");
  }

  return response.data.data.session.pickupPoint.pickupPoints.points.data;
}
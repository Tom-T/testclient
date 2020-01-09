const { execute } = require("apollo-link");
const { WebSocketLink } = require("apollo-link-ws");
const { SubscriptionClient } = require("subscriptions-transport-ws");
const ws = require("ws");

const getWsClient = function(wsurl) {
  const client = new SubscriptionClient(wsurl, { reconnect: true }, ws);
  return client;
};

const createSubscriptionObservable = (wsurl, query, variables) => {
  const link = new WebSocketLink(getWsClient(wsurl));
  return execute(link, { query: query, variables: variables });
};

const gql = require("graphql-tag");
// A subscription query to get changes for author with parametrised id
// using $id as a query variable
const SUBSCRIBE_QUERY = gql`
  subscription {
    wifiNetwork {
      mutation
      data {
        id
        name
        ssid
        key
        enable5g
        postfix5g
        enable24g
        postfix24
      }
    }
  }
`;

const subscriptionClient = createSubscriptionObservable(
  "https://wifi-config.herokuapp.com/", // GraphQL endpoint
  // "http://localhost:4000/", // GraphQL endpoint
  SUBSCRIBE_QUERY, // Subscription query
  { id: 1 } // Query variables
);
var consumer = subscriptionClient.subscribe(
  eventData => {
    // Do something on receipt of the event
    console.log("Received event: ");
    console.log(JSON.stringify(eventData, null, 2));
  },
  err => {
    console.log("Err");
    console.log(err);
  }
);
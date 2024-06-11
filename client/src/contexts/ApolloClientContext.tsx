import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

const client = new ApolloClient({
  uri: "https://dertka.eu-central-a.ibm.stepzen.net/api/hopping-possum/__graphql",
  headers: {
    Authorization:
      "Apikey dertka::local.net+1000::4debfbca846a56ad09e327667b661df10846c2a2094c6e86a2c91a24b79deff5",
  },
  cache: new InMemoryCache(),
});

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;

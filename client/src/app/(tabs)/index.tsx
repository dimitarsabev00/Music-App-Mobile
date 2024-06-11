import { ActivityIndicator, FlatList } from "react-native";
import TrackListItem from "@/src/components/TrackListItem";
import { Text } from "@/src/components/Themed";
import { gql, useQuery } from "@apollo/client";

const getRecommendations = gql`
  query GetRecommendations($genres: String!) {
    recommendations(seed_genres: $genres) {
      tracks {
        id
        name
        preview_url
        artists {
          id
          name
        }
        album {
          id
          name
          images {
            url
            height
            width
          }
        }
      }
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(getRecommendations, {
    variables: { genres: "pop" },
  });

  if (loading) {
    return <ActivityIndicator style={{marginTop: 20}}/>;
  }

  if (error) {
    return <Text>Failed to fetch recommendations. {error.message}</Text>;
  }
  
  const tracks = data?.recommendations?.tracks || [];


  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => <TrackListItem track={item} />}
    />
  );
};

export default Home;

import TrackListItem from "@/src/components/TrackListItem";
import { gql, useQuery } from "@apollo/client";
import { ActivityIndicator, FlatList } from "react-native";

const getFavorites = gql`
  query getFavorites($userId: String!) {
    favoritesByUserid(userid: $userId) {
      id
      trackid
      userid
      track {
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
            width
            height
          }
        }
      }
    }
  }
`;

export default function Favorites() {
  const { data, loading, error } = useQuery(getFavorites, {
    variables: { userId: "cknxcdjqn7" },
  });

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    console.log(error);
  }
  const favoritesTracks = (data?.favoritesByUserid || []).map(
    (fav: any) => fav.track
  );

  return (
    <FlatList
      data={favoritesTracks}
      renderItem={({ item }) => <TrackListItem track={item} />}
    />
  );
}

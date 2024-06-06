import { FlatList } from "react-native";
import { tracks } from "@/src/data/tracks";
import TrackListItem from "@/src/components/TrackListItem";

const Home = () => {
  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => <TrackListItem track={item} />}
    />
  );
};

export default Home;

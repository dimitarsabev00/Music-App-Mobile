import TrackListItem from "@/src/components/TrackListItem";
import { tracks } from "@/src/data/tracks";
import { FlatList } from "react-native";

export default function Favorites() {
  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => <TrackListItem track={item} />}
    />
  );
}

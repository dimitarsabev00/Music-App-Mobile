import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { tracks } from "@/src/data/tracks";
import TrackListItem from "@/src/components/TrackListItem";

const Search = () => {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="search" size={16} color="gray" />
        <TextInput
          value={search}
          placeholder="What do you want to listen to?"
          placeholderTextColor="gray"
          onChangeText={setSearch}
          style={styles.input}
        />
        {search.length > 0 && (
          <Text style={styles.text} onPress={() => setSearch("")}>
            Cancel
          </Text>
        )}
      </View>

      <FlatList
        data={tracks.filter((track) =>
          track.name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={({ item }) => <TrackListItem track={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#121314",
    color: "white",
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 5,
  },
  text: {
    color: "white",
  },
});
export default Search;

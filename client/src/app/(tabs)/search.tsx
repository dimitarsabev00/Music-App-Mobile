import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { tracks } from "@/src/data/tracks";
import TrackListItem from "@/src/components/TrackListItem";
import { gql, useQuery } from "@apollo/client";

const searchQuery = gql`
  query SearchQuery($q: String!) {
    search(q: $q) {
      tracks {
        items {
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
  }
`;

const Search = () => {
  const [search, setSearch] = useState("");

  const { data, loading, error } = useQuery(searchQuery, {
    variables: { q: search },
  });

  const tracks = data?.search?.tracks?.items || [];
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

      {loading && <ActivityIndicator />}
      {error && <Text>Failed to fetch tracks</Text>}

      <FlatList
        data={tracks}
        renderItem={({ item }) => <TrackListItem track={item} />}
        showsVerticalScrollIndicator={false}
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

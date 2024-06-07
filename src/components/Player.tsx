import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useEffect, useState } from "react";
import { AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

const Player = () => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { playTrack } = usePlayerContext();

  const handlePlayTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    if (!playTrack?.preview_url) {
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: playTrack.preview_url,
    });
    setSound(newSound);

    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await newSound.playAsync();
  };

  useEffect(() => {
    if (playTrack) {
      handlePlayTrack();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [playTrack]);

  if (!playTrack) {
    return null;
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    setIsPlaying(status.isPlaying);
  };
  const handlePauseTrack = async () => {
    if (!sound) {
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {playTrack.album.images?.[0] && (
          <Image
            source={{ uri: playTrack.album.images?.[0].url }}
            style={styles.image}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{playTrack.name}</Text>
          <Text style={styles.subtitle}>{playTrack.artists[0]?.name}</Text>
        </View>

        <Ionicons
          name={"heart-outline"}
          size={20}
          color={"white"}
          style={{ marginHorizontal: 10 }}
        />
        <TouchableOpacity
          disabled={!playTrack?.preview_url}
          onPress={handlePlayTrack}
        >
          <Ionicons
            onPress={handlePauseTrack}
            name={isPlaying ? "play" : "pause"}
            size={22}
            color={playTrack?.preview_url ? "white" : "gray"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    top: -75,
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: "#286660",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: "white",
  },
  subtitle: {
    color: "lightgray",
    fontSize: 12,
  },
  image: {
    height: "100%",
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default Player;

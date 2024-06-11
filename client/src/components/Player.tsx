import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useEffect, useState } from 'react';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { gql, useMutation, useQuery } from '@apollo/client';

const insertFavoriteMutation = gql`
  mutation MyMutation($userId: String!, $trackId: String!) {
    insertFavorites(userid: $userId, trackid: $trackId) {
      id
      trackid
      userid
    }
  }
`;

const removeFavoriteMutation = gql`
  mutation MyMutation($trackId: String!, $userId: String!) {
    deleteFavorites(trackid: $trackId, userid: $userId) {
      id
    }
  }
`;

const isFavoriteQuery = gql`
  query MyQuery($trackId: String!, $userId: String!) {
    favoritesByTrackidAndUserid(trackid: $trackId, userid: $userId) {
      id
      trackid
      userid
    }
  }
`;

const Player = () => {
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const { playTrack } = usePlayerContext();

  const [insertFavorite] = useMutation(insertFavoriteMutation);
  const [removeFavorite] = useMutation(removeFavoriteMutation);

  const { data, refetch } = useQuery(isFavoriteQuery, {
    variables: { userId: 'cknxcdjqn7', trackId: playTrack?.id || '' },
  });
  const isLiked = data?.favoritesByTrackidAndUserid?.length > 0;

  useEffect(() => {
    handlePlayTrack();
  }, [playTrack]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    setIsPlaying(status.isPlaying);
  };

  const onPlayPause = async () => {
    if (!sound) {
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const onLike = async () => {
    if (!playTrack) return;
    if (isLiked) {
      await removeFavorite({
        variables: { userId: 'cknxcdjqn7', trackId: playTrack.id },
      });
    } else {
      await insertFavorite({
        variables: { userId: 'cknxcdjqn7', trackId: playTrack.id },
      });
    }
    refetch();
  };

  if (!playTrack) {
    return null;
  }

  const image = playTrack.album.images?.[0];

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {image && <Image source={{ uri: image.url }} style={styles.image} />}

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{playTrack.name}</Text>
          <Text style={styles.subtitle}>{playTrack.artists[0]?.name}</Text>
        </View>

        <Ionicons
          onPress={onLike}
          name={isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={'white'}
          style={{ marginHorizontal: 10 }}
        />
        <Ionicons
          onPress={onPlayPause}
          disabled={!playTrack?.preview_url}
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={playTrack?.preview_url ? 'white' : 'gray'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -75,
    width: '100%',
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: '#286660',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 12,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default Player;
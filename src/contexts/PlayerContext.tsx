import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { Track } from '../Types';

type PlayerContextType = {
  playTrack?: Track;
  setPlayTrack: (track: Track) => void;
};

const PlayerContext = createContext<PlayerContextType>({
  playTrack: undefined,
  setPlayTrack: () => {},
});

export default function PlayerProvider({ children }: PropsWithChildren) {
  const [playTrack, setPlayTrack] = useState<Track>();

  return (
    <PlayerContext.Provider value={{ playTrack, setPlayTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
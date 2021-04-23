import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  play: (episode: Episode) => void;
  playList: (episodeList: Episode[], episodeIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
}

type PlayerContextProps = {
  children : ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children } : PlayerContextProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const playList = useCallback((episodeList: Episode[], episodeIndex: number) => {
    setEpisodeList(episodeList);
    setCurrentEpisodeIndex(episodeIndex);
    setIsPlaying(true);
  }, [])

  const hasPrevious = useMemo(() => currentEpisodeIndex - 1 >= 0, 
  [currentEpisodeIndex]);

  const hasNext = useMemo(() => isShuffling || currentEpisodeIndex + 1 < episodeList.length, 
    [currentEpisodeIndex, episodeList, isShuffling])

  const playNext = useCallback(() => {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

  }, [currentEpisodeIndex, episodeList, hasNext, isShuffling])

  const playPrevious = useCallback(() => {
    const previousIndex = currentEpisodeIndex - 1;

    if (!hasPrevious) {
      return;
    }

    setCurrentEpisodeIndex(previousIndex);
  }, [currentEpisodeIndex, hasPrevious])

  const clearPlayer = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying]);

  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping)
  }, [isLooping]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling)
  }, [isShuffling]);

  const setPlayingState = useCallback((state: boolean) => setIsPlaying(state), []);

  return (
    <PlayerContext.Provider value={
      {
        episodeList,
        currentEpisodeIndex,
        hasNext,
        hasPrevious,
        play,
        playList,
        playNext,
        playPrevious,
        clearPlayer,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState
      }
    }>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () : PlayerContextData => useContext(PlayerContext);

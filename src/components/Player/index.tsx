import Image from 'next/image';
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasPrevious,
    hasNext,
    playNext,
    playPrevious,
    clearPlayer,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play()
    }
    else {
      audioRef.current.pause()
    }
  }, [isPlaying]);

  const episode = useMemo(
    () => episodeList[currentEpisodeIndex], 
    [episodeList, currentEpisodeIndex]
  )

  const setupProgressListener = useCallback(() => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }, [audioRef]);

  const handleSeek = useCallback((amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }, [audioRef]);

  const handleEpisodeEnd = useCallback(() => {
    if(hasNext) {
      playNext();

    } else {
      clearPlayer();
    }
  },[hasNext, playNext, clearPlayer]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }


      <footer className={!episode? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361'}}
                railStyle={{ backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
              />
            ):
            (
              <div className={styles.emptySlider}/>
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnd}
            onLoadedMetadata={setupProgressListener}
            />
        )
        }


        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || isLooping}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >

            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>

          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar Anterior"/>
          </button>
        
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            <img 
              src={isPlaying ? "/pause.svg" : "/play.svg"}
              alt={isPlaying ? "Pausar" : "Tocar"}
            />
          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próximo"/>
          </button>

          <button
            type="button"
            disabled={!episode || isShuffling}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        
        </div>
        
      </footer>
    </div>
  )
}
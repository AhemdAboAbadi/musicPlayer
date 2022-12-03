import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Animated,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import React, {useEffect, useState, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Slider} from 'react-native';
import songs from '../model/data';

const {width, height} = Dimensions.get('window');

const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      // Capabilities that will show up on the lock screen
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs);
  } catch (e) {
    console.log(e);
  }
};

const togglePlayback = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack == null) {
    if (playBackState === State.Paused) {
      await TrackPlayer.play();
    }
  } else {
    await TrackPlayer.pause();
  }
};

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const [songINdex, setSongIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackArtwork, setTrackArtwork] = useState('');
  const [repeatMode, setRepeatMode] = useState('off');
  const songSlider = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const progress = useProgress();

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist, artwork} = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    setUpPlayer();
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
      console.log(
        '🚀 ~ file: MusicPlayer.js:26 ~ scrollX.addListener ~ index',
        index,
      );
    });
  }, [scrollX]);

  const skipToNext = async () => {
    songSlider.current.scrollToOffset({
      offset: (songINdex + 1) * width,
    });
  };
  const skipToPrivies = async () => {
    songSlider.current.scrollToOffset({
      offset: (songINdex - 1) * width,
    });
  };

  const renderSong = ({item, index}) => {
    return (
      <Animated.View style={style.mainImageWrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image source={item.artwork} style={style.musicImage} />
        </View>
      </Animated.View>
    );
  };

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat  ') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSong}
          data={songs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {useNativeDriver: false},
          )}
        />

        <View>
          <Text style={style.songTitle}>{trackTitle}</Text>
          <Text style={style.songArtist}>{trackArtist}</Text>
        </View>

        <View>
          <Slider
            style={style.sliderBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={async value => await TrackPlayer.seekTo(value)}
          />
        </View>
        <View style={style.progressLevelDuration}>
          <Text style={style.progressLevelText}>
            {new Date(progress.position * 1000)
              .toLocaleTimeString()
              .subString(3)}
          </Text>
          <Text style={style.progressLevelText}>
            {new Date(progress.duration - progress.position * 1000)
              .toLocaleTimeString()
              .subString(3)}
          </Text>
        </View>

        <View style={style.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrivies}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayback(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle' // toggle icon
                  : 'ios-play-circle'
              }
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.bottomContainer}>
        <View style={style.bottomIconWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={35} color="#88888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={35}
              color={repeatMode !== 'off' ? '#FFD369' : '#88888888'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={35} color="#88888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={35} color="#88888888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    borderTopColor: '#393E46',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 2,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  mainImageWrapper: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },

  elevation: {
    elevation: 5,
    shadowColor: '#ccc',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eeeeee',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#eeeeee',
  },
  sliderBar: {
    width: 350,
    height: 40,
    marginTop: 20,
  },
  progressLevelDuration: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLevelText: {
    color: '#eeeeee',
    fontWeight: '500',
  },
  musicControlsContainer: {
    borderTopColor: '#3936',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '60%',
    marginTop: 10,
  },
});

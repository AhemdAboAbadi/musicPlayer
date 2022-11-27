import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const MusicPlayer = () => {
  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image
            source={require('../assetsq/img/img1.jpg')}
            style={style.musicImage}
          />
        </View>

        <View>
          <Text style={style.songTitle}>Some Title</Text>
          <Text style={style.songArtist}>Some Title</Text>
        </View>
      </View>

      <View style={style.bottomContainer}>
        <View style={style.bottomIconWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={35} color="#88888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={35} color="#88888888" />
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
});

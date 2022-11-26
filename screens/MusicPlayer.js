import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MusicPlayer = () => {
  return (
    <View style={style.container}>
      <Ionicons name="forward" size={30} />
      <Text>Ahmed Abo</Text>
    </View>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Intro from './src/pages/Intro'

export default class DextraService extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Intro />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

AppRegistry.registerComponent('DextraService', () => DextraService);

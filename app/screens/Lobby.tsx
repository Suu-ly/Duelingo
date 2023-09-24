import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import theme from '../common/constants/theme.json';

interface LobbyProps {
    route: any;
    navigation: any;
  }

  const Lobby = (props: LobbyProps) => {
    const {route, navigation} = props;
  
    return (
      <View style={styles.mainContainer}>
        <CustomStatusBar />
        <View style={styles.container}>
          <Text variant={'headlineLarge'}>Lobby</Text>
          <Button
            icon="map-marker-outline"
            mode="outlined"
            onPress={() => navigation.navigate('Home')}>
            Go to Home
          </Button>
          <View style={styles.rowContainer}>
            <DuoButton
              icon={'account-plus-outline'}
              filled={true}
              disabled={false}
              backgroundColor={theme.colors.primary}
              backgroundDark={theme.colors.primaryDark}
              borderColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={() => console.log('Pressed first')}>
              First
            </DuoButton>
            <DuoButton
              icon={'account-plus-outline'}
              filled={true}
              disabled={true}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={() => console.log('Pressed disabled')}>
              First
            </DuoButton>
            <DuoButton
              icon={'account-plus-outline'}
              filled={false}
              disabled={false}
              backgroundColor={'white'}
              borderColor={theme.colors.secondary}
              textColor={theme.colors.secondary}
              onPress={() => console.log('Pressed second')}>
              Second
            </DuoButton>
            <DuoButton
              icon={'account-plus-outline'}
              filled={false}
              disabled={true}
              backgroundColor={'white'}
              textColor={theme.colors.secondary}
              onPress={() => console.log('Pressed second disbled')}>
              Second
            </DuoButton>
            <DuoButton
              icon={'magnify'}
              filled={false}
              disabled={false}
              backgroundColor={'white'}
              borderColor={theme.colors.secondary}
              textColor={theme.colors.secondary}
              onPress={() => console.log('Pressed third')}
            />
          </View>
        </View>
      </View>
    );
  };
  
  export default Lobby;
  
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Constants.defaultGap,
      paddingHorizontal: Constants.edgePadding,
    },
    rowContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Constants.mediumGap,
      justifyContent: 'center',
    },
  });
  
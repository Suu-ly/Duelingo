import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {
  IconButton,
  Button,
  Text,
  TextInput,
  Portal,
  Dialog,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {EventArg, NavigationAction} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import DuoButton from '../common/DuoButton';
import Theme from '../common/constants/theme.json';

interface ProfileProps {
  route: any;
  navigation: any;
  userId?: string;
}

const Profile = (props: ProfileProps) => {
  const [index, setIndex] = useState(0);
  const {route, navigation} = props;
  const usersCollection = firestore().collection('Users').get();
  const userId = auth().currentUser?.uid;

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.topContainer}>
        <View style={styles.filler} />
        <Image source={require('../assets/Duo.png')} style={styles.duo} />
        <IconButton
          icon={'cog-outline'}
          iconColor={Theme.colors.onSurfaceVariant}
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.infoContainer}>
          <Text variant={'headlineLarge'}>Name</Text>
          <Text style={{color: Theme.colors.outline}} variant={'titleMedium'}>
            {userId}
          </Text>
          <Button
            style={{
              marginHorizontal: 0,
              justifyContent: 'flex-end',
              flexDirection: 'row-reverse',
              marginVertical: 0,
            }}>
            Friends (leads to friends page){' '}
          </Button>
        </View>
        <DuoButton
          filled={true}
          disabled={false}
          stretch={true}
          icon={'account-plus-outline'}
          backgroundColor={Theme.colors.primary}
          backgroundDark={Theme.colors.primaryDark}
          borderColor={Theme.colors.primary}
          textColor={Theme.colors.onPrimary}
          onPress={() => navigation.navigate('EditProfile')}>
          Add Friends
        </DuoButton>
        <View style={styles.progressContainer}>
          <Image
            source={require('../assets/ChinaFlag.png')}
            style={styles.Flag}
          />
          <View style={styles.progressContainerRight}>
            <Text style={styles.Progress} variant={'bodyLarge'}>
              Chinese
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Image
            source={require('../assets/MalaysiaFlag.png')}
            style={styles.Flag}
          />
          <View style={styles.progressContainerRight}>
            <Text style={styles.Progress} variant={'bodyLarge'}>
              Malay
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  filler: {
    height: Constants.buttonSize,
    width: Constants.buttonSize,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Constants.smallGap,
  },
  progressContainer: {
    justifyContent: 'flex-start',
    gap: Constants.largeGap,
    paddingVertical: Constants.edgePadding,
    paddingHorizontal: Constants.edgePadding,
    flexDirection: 'row',
    borderColor: Theme.colors.outlineVariant,
    //display: 'flex',
    alignItems: 'center',
    borderRadius: 12,
    borderBlockColor: Theme.colors.outlineVariant,
    borderWidth: 1,
  },
  progressContainerRight: {
    justifyContent: 'flex-start',
    gap: 4,
    flexDirection: 'column',
    borderColor: Theme.colors.outlineVariant,
    alignItems: 'flex-start',
    borderRadius: 12,
    borderBlockColor: Theme.colors.outlineVariant,
    borderWidth: 1,
  },
  duo: {
    overflow: 'hidden',
    borderRadius: 500,
    width: 256,
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duelingo: {
    width: 179,
    height: 44,
  },
  button: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    //marginHorizontal: 0,
  },
  middleContainer: {
    gap: Constants.defaultGap,
    paddingHorizontal: Constants.edgePadding,
  },
  infoContainer: {
    gap: 8,
  },
  Progress: {
    color: Theme.colors.onSurface,
    paddingHorizontal: 11,
    paddingTop: 5,
    flexDirection: 'row',
  },
  Flag: {
    width: 48,
    height: 34.286,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
  },
});

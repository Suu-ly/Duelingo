import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Appbar, Button, IconButton, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import Avatar from '../common/Avatar';

interface SelectAvatarProps {
  route: any;
  navigation: any;
}

const SelectAvatar = (props: SelectAvatarProps) => {
  const {route, navigation} = props;

  const pics = Array(14).fill(0);

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.header}>
        <IconButton
          icon="window-close"
          iconColor={Theme.colors.onSurface}
          size={24}
          onPress={() =>
            navigation.navigate('HomeScreen', {
              screen: 'Profile',
              params: {screen: 'EditProfile'},
            })
          }
        />
        <Text variant="titleLarge">Change Profile Picture</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.picsContainer}>
          {pics.map((data, index) => {
            return (
              <View
                key={index}
                style={[styles.picContainer, {width: '33.3333%'}]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => console.log(index)}>
                  <Avatar index={index} style={styles.avatar} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SelectAvatar;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
    paddingHorizontal: Constants.smallGap,
    paddingVertical: Constants.mediumGap,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    flex: 1,
  },
  picsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    padding: Constants.edgePadding - Constants.defaultGap / 2,
    paddingBottom: Constants.edgePadding,
  },
  picContainer: {
    padding: Constants.defaultGap / 2,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  button: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 256,
  },
});

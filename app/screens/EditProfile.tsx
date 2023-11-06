import {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {Appbar, Button, IconButton, Text} from 'react-native-paper';
import Theme from '../common/constants/theme.json';
import CustomStatusBar from '../common/CustomStatusBar';
import Constants from '../common/constants/Constants';
import Avatar from '../common/Avatar';

interface EditProfileProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
}

const EditProfile = (props: EditProfileProps) => {
  const {route, navigation, translate} = props;

  const [visible, setVisible] = useState(false);

  const pics = Array(15).fill(0);

  return (
    <Animated.View
      style={[styles.mainContainer, {transform: [{translateY: translate}]}]}>
      <CustomStatusBar />
      <Appbar.Header mode="large">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Profile" />
      </Appbar.Header>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View style={styles.header}>
          <IconButton
            icon="window-close"
            iconColor={Theme.colors.onSurface}
            size={24}
            onPress={() => setVisible(false)}
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
      </Modal>
      <Button mode="outlined" onPress={() => setVisible(true)}>
        Open
      </Button>
    </Animated.View>
  );
};

export default EditProfile;

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
    backgroundColor: Theme.colors.surface,
  },
  scroll: {
    width: '100%',
    flex: 1,
    backgroundColor: Theme.colors.surface,
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
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 256,
  },
});

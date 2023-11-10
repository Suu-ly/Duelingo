import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  HelperText,
  IconButton,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {EventArg, NavigationAction} from '@react-navigation/native';

import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';
import Avatar from '../common/Avatar';
import DuoButton from '../common/DuoButton';

interface EditProfileProps {
  route: any;
  navigation: any;
  translate: Animated.Value;
  opacity: Animated.Value;
}

const EditProfile = (props: EditProfileProps) => {
  const {route, navigation, translate, opacity} = props;
  const data = route.params.userData;
  const [avatar, setAvatar] = useState<number>(data.avatar);
  const [username, setUsername] = useState<string>(data.username);
  const [displayName, setDisplayName] = useState<string>(data.displayName);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const hasChanges =
    username !== data.username ||
    displayName !== data.displayName ||
    avatar !== data.avatar;

  const pics = Array(15).fill(0);

  useEffect(
    () =>
      navigation.addListener(
        'beforeRemove',
        (e: EventArg<'beforeRemove', true, {action: NavigationAction}>) => {
          if (!hasChanges || e.data.action.type !== 'GO_BACK') {
            return;
          }
          // Prevent default behavior of leaving the screen
          e.preventDefault();
          // Prompt the user before leaving the screen
          setDialogVisible(true);
        },
      ),
    [navigation, hasChanges],
  );

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {transform: [{translateY: translate}], opacity: opacity},
      ]}>
      <Appbar.Header mode="large">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Profile" />
      </Appbar.Header>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <View>
            <Avatar index={avatar} style={styles.avatar} />
            <Button
              onPress={() => setVisible(true)}
              icon="pencil-outline"
              mode="text">
              Change
            </Button>
          </View>
          <View style={styles.fullWidth}>
            <TextInput
              style={{backgroundColor: Theme.colors.surface}}
              mode="outlined"
              label="Username"
              placeholder="Set username"
              value={username}
              activeOutlineColor={Theme.colors.primary}
              autoCapitalize="none"
              onChangeText={name => setUsername(name)}
            />
            {error && (
              <HelperText type="error" visible={true}>
                Invalid email address format.
              </HelperText>
            )}
          </View>
          <TextInput
            style={[styles.fullWidth, {backgroundColor: Theme.colors.surface}]}
            mode="outlined"
            label="Display Name"
            placeholder="Set username"
            value={displayName}
            activeOutlineColor={Theme.colors.primary}
            autoCapitalize="none"
            onChangeText={name => setDisplayName(name)}
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <DuoButton
              backgroundColor={Theme.colors.surface}
              borderColor={Theme.colors.outline}
              stretch={true}
              filled={false}
              onPress={() => navigation.goBack()}
              textColor={Theme.colors.onSurface}>
              Cancel
            </DuoButton>
          </View>

          <View style={styles.buttonContainer}>
            <DuoButton
              backgroundColor={Theme.colors.primary}
              backgroundDark={Theme.colors.primaryDark}
              stretch={true}
              disabled={!hasChanges}
              onPress={() => console.log('Pressed')}
              textColor={Theme.colors.onPrimary}>
              Save Changes
            </DuoButton>
          </View>
        </View>
      </View>
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
                <View key={index} style={[styles.picContainer]}>
                  <TouchableOpacity
                    style={styles.avatarButton}
                    onPress={() => {
                      setVisible(false);
                      setAvatar(index);
                    }}>
                    <Avatar index={index} style={styles.avatars} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Modal>
      <Portal>
        <Dialog
          visible={dialogVisible}
          dismissable={false}
          dismissableBackButton={false}>
          <Dialog.Icon icon={'alert-circle-outline'} />
          <Dialog.Title style={styles.title}>
            You have unsaved changes.
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You have not yet saved your changes. Are you sure you want to
              leave?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setDialogVisible(false);
                navigation.pop();
              }}>
              Leave
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Animated.View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  contentContainer: {
    padding: Constants.edgePadding,
    paddingTop: 0,
    flex: 1,
    justifyContent: 'space-between',
    gap: Constants.edgePadding,
  },
  inputContainer: {
    gap: Constants.edgePadding,
    alignItems: 'center',
  },
  avatar: {
    height: 128,
    width: 128,
    borderRadius: 128,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Constants.edgePadding,
  },
  buttonContainer: {
    flex: 1,
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
    width: '33.33333333333%',
    padding: Constants.defaultGap / 2,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  avatarButton: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  avatars: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 256,
  },
  title: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});

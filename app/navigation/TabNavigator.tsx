import {
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Animated,
  Easing,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import {useCallback, useRef, useState} from 'react';

import Home from '../screens/Home';
import Leaderboard from '../screens/Leaderboard';
import Challenge from '../screens/Challenge';
import ProfileStackNavigator from './ProfileStackNavigator';
import CustomStatusBar from '../common/CustomStatusBar';
import Dropdown from '../common/DropdownButton';
import HeartContainer from '../common/HeartContainer';
import Theme from '../common/constants/theme.json';
import Constants from '../common/constants/Constants';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const translate = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const languageDropDown = [
    {
      id: 1,
      value: 'Chinese',
      icon: require('../assets/ChinaFlagRound.png'),
    },
    {
      id: 2,
      value: 'Malay',
      icon: require('../assets/MalaysiaFlagRound.png'),
    },
  ];
  //Get the selected item of the language array
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
    icon: ImageSourcePropType;
  }>(languageDropDown[0]);
  const onSelect = (item: any) => {
    setSelectedItem(item);
  };

  const fadeIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(translate, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.bezier(0, 0, 0.4, 1.0),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.bezier(0, 0, 0.4, 1.0),
      }),
    ]).start();
  }, [translate]);

  const listeners = ({navigation, route}: any) => ({
    focus: (e: any) => {
      translate.setValue(30);
      opacity.setValue(0);
      fadeIn();
    },
  });

  const header = (props: BottomTabHeaderProps) => {
    return (
      <>
        <CustomStatusBar backgroundColor={Theme.colors.elevation.level1} />

        <View style={styles.toprowContainer}>
          <Dropdown
            data={languageDropDown}
            item={selectedItem}
            onSelect={onSelect}
          />
          <HeartContainer lives={5} />
        </View>
      </>
    );
  };

  return (
    <Tab.Navigator
      screenListeners={listeners}
      screenOptions={{header: header, freezeOnBlur: true}}
      backBehavior="history"
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                ? options.title
                : route.name;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="home" size={size} color={color} />
            ) : (
              <Icon name="home-outline" size={size} color={color} />
            );
          },
        }}>
        {props => (
          <Home
            {...props}
            translate={translate}
            opacity={opacity}
            selectedLanguage={selectedItem}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Leaderboard"
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="medal" size={size} color={color} />
            ) : (
              <Icon name="medal-outline" size={size} color={color} />
            );
          },
        }}>
        {props => (
          <Leaderboard {...props} translate={translate} opacity={opacity} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Challenge"
        options={{
          tabBarLabel: 'Challenge',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="trophy" size={size} color={color} />
            ) : (
              <Icon name="trophy-outline" size={size} color={color} />
            );
          },
        }}>
        {props => (
          <Challenge
            {...props}
            translate={translate}
            opacity={opacity}
            language={selectedItem.value}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="account" size={size} color={color} />
            ) : (
              <Icon name="account-outline" size={size} color={color} />
            );
          },
        }}>
        {props => (
          <ProfileStackNavigator
            {...props}
            translate={translate}
            opacity={opacity}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
const styles = StyleSheet.create({
  toprowContainer: {
    backgroundColor: Theme.colors.elevation.level1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Constants.edgePadding,
    paddingVertical: Constants.mediumGap,
  },
});

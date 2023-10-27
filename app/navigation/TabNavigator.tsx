import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Leaderboard from '../screens/Leaderboard';
import Challenge from '../screens/Challenge';
import Profile from '../screens/Profile';
import {BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Easing} from 'react-native/Libraries/Animated/Easing';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      backBehavior="order"
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          //   animationEasing={Easing.ease}
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
        name="Base"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="home" size={size} color={color} />
            ) : (
              <Icon name="home-outline" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="medal" size={size} color={color} />
            ) : (
              <Icon name="medal-outline" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={Challenge}
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="trophy" size={size} color={color} />
            ) : (
              <Icon name="trophy-outline" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({focused, color, size}) => {
            return focused ? (
              <Icon name="account" size={size} color={color} />
            ) : (
              <Icon name="account-outline" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

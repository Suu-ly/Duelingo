import * as React from 'react';
import {BottomNavigation} from 'react-native-paper';
import Home from '../screens/Home';
import Leaderboard from '../screens/Leaderboard';
import Challenge from '../screens/Challenge';
import Profile from '../screens/Profile';
import {Easing} from 'react-native';

interface BottomTabsProps {
  route: any;
  navigation: any;
}

const BottomTabBar = (props: BottomTabsProps) => {
  const {route, navigation} = props;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'Home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'Leaderboard',
      title: 'Leaderboard',
      focusedIcon: 'medal',
      unfocusedIcon: 'medal-outline',
    },
    {key: 'Challenge', title: 'Challenge', focusedIcon: 'trophy-outline'},
    {
      key: 'Profile',
      title: 'Profile',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ]);
  const HomeRoute = () => <Home route={route} navigation={navigation} />;

  const LeaderboardRoute = () => (
    <Leaderboard route={route} navigation={navigation} />
  );

  const ChallengeRoute = () => (
    <Challenge route={route} navigation={navigation} />
  );

  const ProfileRoute = () => <Profile route={route} navigation={navigation} />;

  const renderScene = BottomNavigation.SceneMap({
    Home: HomeRoute,
    Leaderboard: LeaderboardRoute,
    Challenge: ChallengeRoute,
    Profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      onTabPress={route => console.log(route)}
      renderScene={renderScene}
      sceneAnimationType="shifting"
      sceneAnimationEnabled={true}
      sceneAnimationEasing={Easing.bezier(0.05, 0.7, 0.1, 1.0)}
    />
  );
};

export default BottomTabBar;

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
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'leaderboard',
      title: 'Leaderboard',
      focusedIcon: 'medal',
      unfocusedIcon: 'medal-outline',
    },
    {key: 'challenge', title: 'Challenge', focusedIcon: 'trophy-outline'},
    {
      key: 'profile',
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
    home: HomeRoute,
    leaderboard: LeaderboardRoute,
    challenge: ChallengeRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationType="shifting"
      sceneAnimationEnabled={true}
      sceneAnimationEasing={Easing.bezier(0.05, 0.7, 0.1, 1.0)}
    />
  );
};

export default BottomTabBar;

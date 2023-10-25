import * as React from 'react';
import {BottomNavigation} from 'react-native-paper';
import Home from '../screens/Home';
import Leaderboard from '../screens/Leaderboard';
import Challenge from '../screens/Challenge';
import Profile from '../screens/Profile';
import {Easing} from 'react-native';

const HomeRoute = () => <Home route={undefined} navigation={undefined} />;

const LeaderboardRoute = () => (
  <Leaderboard route={undefined} navigation={undefined} />
);

const ChallengeRoute = () => (
  <Challenge route={undefined} navigation={undefined} />
);

const ProfileRoute = () => <Profile route={undefined} navigation={undefined} />;

const BottomTabBar = () => {
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

import React from 'react';
import {View, StyleSheet, Button} from 'react-native';

import Colors from '../common/constants/Colors';
import Label from '../common/Label';
import TextStyles from '../common/constants/TextStyles';
import CustomStatusBar from '../common/CustomStatusBar';

interface HomeProps {
  route: any;
  navigation: any;
}

const Home = (props: HomeProps) => {
  const {route, navigation} = props;

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar />
      <View style={styles.container}>
        <Label
          title={'Home Screen'}
          color={Colors.black}
          style={TextStyles.bodyLarge}
        />
        <Button
          title={'Go to filter'}
          onPress={() => navigation.navigate('Filter')}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

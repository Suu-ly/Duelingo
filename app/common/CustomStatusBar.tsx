import {StatusBar, StyleSheet, View} from 'react-native';

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

const CustomStatusBar = (props: StatusBarProps) => {
  const {backgroundColor = 'transparent', barStyle = 'dark-content'} = props;
  return (
    <View style={[styles.barContainer, {backgroundColor: backgroundColor}]}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={barStyle}
        translucent={true}
      />
    </View>
  );
};

export default CustomStatusBar;

const styles = StyleSheet.create({
  barContainer: {
    height: StatusBar.currentHeight,
  },
});

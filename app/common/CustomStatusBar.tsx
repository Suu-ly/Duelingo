import {StatusBar} from 'react-native';

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

const CustomStatusBar = (props: StatusBarProps) => {
  const {backgroundColor = 'transparent', barStyle = 'dark-content'} = props;
  return (
    <StatusBar
      animated={true}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      translucent={true}
    />
  );
};

export default CustomStatusBar;

import {Image, ImageStyle, StyleProp} from 'react-native';

interface AvatarProps {
  index: number;
  style?: StyleProp<ImageStyle>;
}

const Avatar = (props: AvatarProps) => {
  const {index, style} = props;

  const pics = [
    require('../assets/Avatars/1.png'),
    require('../assets/Avatars/0.png'),
    require('../assets/Avatars/2.png'),
    require('../assets/Avatars/3.png'),
    require('../assets/Avatars/4.png'),
    require('../assets/Avatars/5.png'),
    require('../assets/Avatars/6.png'),
    require('../assets/Avatars/7.png'),
    require('../assets/Avatars/8.png'),
    require('../assets/Avatars/9.png'),
    require('../assets/Avatars/10.png'),
    require('../assets/Avatars/11.png'),
    require('../assets/Avatars/12.png'),
    require('../assets/Avatars/13.png'),
    require('../assets/Avatars/14.png'),
  ];

  return <Image source={pics[index]} style={style} resizeMode="cover" />;
};

export default Avatar;

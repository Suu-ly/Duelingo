import {StyleSheet, View} from 'react-native';
import DuoButton from './DuoButton';
import {useState} from 'react';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';
import Tts from 'react-native-tts';

interface QuizButtonProps {
  question: {
    question: string;
    options: Array<string>;
    correct_answer: string;
    explanation: string;
  };
  backgroundColor: string;
  reveal: boolean;
  onSelect: (callback: string) => void;
}

const QuizButtons = (props: QuizButtonProps) => {
  const {question, backgroundColor, reveal, onSelect} = props;

  const [selected, setSelected] = useState('');

  const containsEnglish = (text: string): boolean => {
    // Regular expression to match English characters
    const englishRegex = /^[A-Za-z]+$/;
    return englishRegex.test(text);
  };

  const optionContainsEnglish = containsEnglish(question.options[0]);

  const init_tts = async () => {
    Tts.setDefaultPitch(1);
    Tts.setDefaultLanguage(optionContainsEnglish ? 'en-US' : 'zh-CN');
    Tts.setDefaultRate(optionContainsEnglish ? 0.3 : 0.5);
  };

  init_tts();

  const readText = async (text: string) => {
    Tts.stop();
    Tts.speak(text);
  };

  const selectHandler = (option: string) => {
    setSelected(option);
    onSelect(option);
    readText(option);
  };

  return (
    <View style={styles.quizContainer}>
      {question.options.map((option, index) => {
        return (
          <DuoButton
            key={index}
            filled={false}
            inactive={reveal}
            backgroundColor={backgroundColor}
            onPress={() => selectHandler(option)}
            height={60}
            stretch={true}
            textVariant="headlineSmall"
            textColor={Theme.colors.onSurface}
            borderColor={
              reveal &&
              selected === option &&
              selected !== question.correct_answer
                ? Theme.colors.error
                : (reveal && question.correct_answer === option) ||
                  selected === option
                ? Theme.colors.primaryContainer
                : Theme.colors.outline
            }>
            {option}
          </DuoButton>
        );
      })}
    </View>
  );
};

export default QuizButtons;

const styles = StyleSheet.create({
  quizContainer: {
    gap: Constants.mediumGap,
    alignSelf: 'stretch',
  },
});

import {StyleSheet, View} from 'react-native';
import DuoButton from './DuoButton';
import {useState} from 'react';
import Theme from './constants/theme.json';
import Constants from './constants/Constants';

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

  const selectHandler = (option: string) => {
    setSelected(option);
    onSelect(option);
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

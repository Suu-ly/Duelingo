import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

// Get All Quizzes
export const getAllQuiz = () => {
  return firestore().collection('Quizzes').get();
};

// Get Quiz With Specific Language
export const getQuiz = (language: any) => {
  return firestore().collection('Quizzes').doc(language).get();
};

export const createUser = (email: any, username: any, displayName: any) => {
  return firestore()
    .collection('Users')
    .add({
      displayName: displayName,
      username: username,
      email: email,
      exp: 0,
      friends: [{uid: 0}],
      hearts: {
        amount: 5,
        timestamp: 0,
      },
      modules: {
        easy: 9,
        intermediate: 9,
        hard: 9,
      },
    })
    .then(() => {
      console.log('User created.');
    });
};

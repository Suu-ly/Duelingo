import firestore from '@react-native-firebase/firestore';

// Get All Quizzes
export const getAllQuiz = () => {
  return firestore().collection('Quizzes').get();
};

// Get Quiz With Specific Language
export const getQuiz = (language: any) => {
  return firestore().collection('Quizzes').doc(language).get();
};

//Get Username
export const getUsername = (uid: any) => {
  return firestore().collection('Users').doc(uid).collection('username').get();
};

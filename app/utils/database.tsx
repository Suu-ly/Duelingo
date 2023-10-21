import firestore from '@react-native-firebase/firestore';

// Get All Quizzes
export const getAllQuiz = () => {
  return firestore().collection('Quizzes').get();
};

// Get Quiz With Specific Language
export const getQuiz = (language: any) => {
  return firestore().collection('Quizzes').doc(language).get();
};

export const createUser = (
  email: any,
  username: any,
  displayName: any,
  uid: any,
) => {
  firestore()
    .collection('Users')
    .doc(uid)
    .set({
      displayName: displayName,
      username: username,
      email: email,
      exp: 0,
      hearts: {
        amount: 5,
        timestamp: 0,
      },
      modules: {
        easy: 9,
        intermediate: 9,
        hard: 9,
      },
      avatar: 0,
    });
  console.log('User created.');

  firestore().collection('Users').doc(uid).collection('Friends').add({});
};

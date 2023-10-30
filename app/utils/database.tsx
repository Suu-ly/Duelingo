import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
      chinese: 0,
      malay: 0,
      avatar: 0,
    });
  console.log('User created.');

  // Create collection with document named 'default', which will be deleted when friend is added
  firestore()
    .collection('Users')
    .doc(uid)
    .collection('Friends')
    .doc('default')
    .set({});
};

export const createFriend = (username: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .where('username', '==', username)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);

            // Add friend into own list
            firestore()
              .collection('Users')
              .doc(uid)
              .collection('Friends')
              .doc(documentSnapshot.id)
              .set({});

            // Add ownself into friend's list
            firestore()
              .collection('Users')
              .doc(documentSnapshot.id)
              .collection('Friends')
              .doc(uid)
              .set({});

            // Delete 'default' if exists in own list
            firestore()
              .collection('Users')
              .doc(uid)
              .collection('Friends')
              .doc('default')
              .delete();

            // Delete 'default' if exists in friend's list
            firestore()
              .collection('Users')
              .doc(documentSnapshot.id)
              .collection('Friends')
              .doc('default')
              .delete();
          });
        });
    }
  });
};

export const deleteFriend = (username: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .where('username', '==', username)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);

            // Delete from own list
            firestore()
              .collection('Users')
              .doc(uid)
              .collection('Friends')
              .doc(documentSnapshot.id)
              .delete();

            // Delete from friend's list
            firestore()
              .collection('Users')
              .doc(documentSnapshot.id)
              .collection('Friends')
              .doc(uid)
              .delete();
          });
        });
    }
  });
};

export const getFriendList = async (): Promise<string[]> => {
  var friendList: string[] = [];
  var user = auth().currentUser;
  if (user) {
    const uid = user.uid;
    await firestore()
      .collection('Users')
      .doc(uid)
      .collection('Friends')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          friendList = [...friendList, documentSnapshot.id];
        });
        console.log(friendList);
      });
  }
  return friendList;
};

export const getFriendDetails = async () => {
  const friendList = await getFriendList();
  var friendDetails = [];

  for (let i = 0; i < friendList.length; i++) {
    var friend = await firestore()
      .collection('Users')
      .doc(friendList[i])
      .get()
      .then(documentSnapshot => {
        // console.log(documentSnapshot.data());
        return documentSnapshot.data();
      });
    friendDetails.push(friend);
  }
  return friendDetails;
};

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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

  // Cannot create empty collection, a document must be added
  firestore().collection('Users').doc(uid).collection('Friends').add({});
};

// export const getUserID = () => {
//   return firestore()
//     .collection('Users')
//     .get()
//     .then(collectionSnapshot => {
//       collectionSnapshot.forEach(documentSnapshot => {
//         console.log('User ID: ', documentSnapshot.id);
//       });
//     });
// };

export const UpdateUsername = (userAccount: any, username: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .where('username', '==', userAccount)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);
            firestore().collection('Users').doc(uid).update({
              displayName: username,
            });
          });
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

export const UpdateHearts = (userAccount: any, hearts: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .where('username', '==', userAccount)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);
            firestore().collection('Users').doc(uid).update({
              hearts: hearts,
            });
          });
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

export const UpdateExp = (userAccount: any, exp: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .where('username', '==', userAccount)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.id);
            firestore().collection('Users').doc(uid).update({
              exp: exp,
            });
          });
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

export const UpdateModules = (
  userAccount: any,
  easy: any,
  medium: any,
  hard: any,
) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .update({
      modules: {easy: easy, medium: medium, hard: hard},
    })
    .then(() => {
      console.log('User updated!');
    });
};

export const DeleteAccount = (userAccount: any) => {
  return firestore()
    .collection('Users')
    .doc(userAccount)
    .delete()
    .then(() => {
      console.log('User deleted!');
    });
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
            firestore()
              .collection('Users')
              .doc(uid)
              .collection('Friends')
              .doc(documentSnapshot.id)
              .set({});
          });
        });
    }
  });
};

export const getFriendList: any = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      var friendList: string[] = [];
      firestore()
        .collection('Users')
        .doc(uid)
        .collection('Friends')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            friendList = [...friendList, documentSnapshot.id];
          });
          // remove first document added during account creation ()
          friendList.shift();
          console.log(friendList);
          return friendList;
        });
    }
  });
};

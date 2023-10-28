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
      chinese: 0,
      malay: 0,
      avatar: 0,
    });
  console.log('User created.');

  // Cannot create empty collection, a document must be added
  firestore().collection('Users').doc(uid).collection('Friends').add({});
};

export const UpdateUsername = (username: any) => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          displayName: username,
        })

        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

export const ResetHearts = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          hearts: {amount: 5, timestamp: 0},
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

function getHearts(documentSnapshot: any) {
  return documentSnapshot.get('hearts.amount');
}

export const UpdateHearts = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getHearts(documentSnapshot))
        .then(current => {
          if (current > 0) {
            firestore()
              .collection('Users')
              .doc(uid)
              .update({
                hearts: {amount: current - 1, timestamp: 0},
              });
          }
        });
    }
  });
};

export const ResetExp = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          exp: 0,
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

function getExp(documentSnapshot: any) {
  return documentSnapshot.get('exp');
}

export const UpdateExp = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getExp(documentSnapshot))
        .then(current => {
          firestore()
            .collection('Users')
            .doc(uid)
            .update({
              exp: current + 100,
            });
        });
    }
  });
};
// export const UpdateModules = (chinese: any, malay: any) => {
//   auth().onAuthStateChanged(user => {
//     if (user) {
//       const uid = user.uid;
//       firestore()
//         .collection('Users')
//         .doc(uid)
//         .update({
//           modules: {chinese: chinese, malay: malay},
//         })
//         .then(() => {
//           console.log('User updated!');
//         });
//     }
//   });
// };

function getChineseMod(documentSnapshot: any) {
  return documentSnapshot.get('chinese');
}

export const UpdateChineseMod = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getChineseMod(documentSnapshot))
        .then(module => {
          firestore()
            .collection('Users')
            .doc(uid)
            .update({
              chinese: module + 1,
            });
        });
    }
  });
};

function getMalayMod(documentSnapshot: any) {
  return documentSnapshot.get('malay');
}

export const UpdateMalayMod = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getMalayMod(documentSnapshot))
        .then(module => {
          firestore()
            .collection('Users')
            .doc(uid)
            .update({
              malay: module + 1,
            });
        });
    }
  });
};

export const ResetModules = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          chinese: 0,
          malay: 0,
        })
        .then(() => {
          console.log('User updated!');
        });
    }
  });
};

export const DeleteUserdata = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .delete()
        .then(() => {
          console.log('User data deleted!');
        });
    }
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

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const UpdateDisplayname = (username: string) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
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
};

export const UpdateAvatar = (avatar: number) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    firestore().collection('Users').doc(uid).update({
      avatar: avatar,
    });
  }
};

export const UpdateUsername = (username: string) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    firestore().collection('Users').doc(uid).update({
      username: username,
    });
  }
};

export const checkUsernameExists = (username: string) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    firestore()
      .collection('Users')
      .where('username', '==', username)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return true;
        } else {
          return false;
        }
      });
  }
};

export const ResetHearts = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          'hearts.amount': 5,
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

export const MinusHearts = () => {
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
                'hearts.amount': current - 1,
              });
          }
        });
    }
  });
};

export const AddHearts = () => {
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
                'hearts.amount': current + 1,
              });
          }
        });
    }
  });
};

// function getTimestamp(documentSnapshot: any) {
//   return documentSnapshot.get('hearts.timestamp');
// }

// export const UpdateTimestamp = () => {
//   auth().onAuthStateChanged(user => {
//     if (user) {
//       const uid = user.uid;
//       firestore()
//         .collection('Users')
//         .doc(uid)
//         .get()
//         .then(documentSnapshot => getTimestamp(documentSnapshot))
//         .then(current => {
//           firestore().collection('Users').doc(uid).update({
//             'hearts.timestamp': serverTimestamp(),
//           });
//         });
//     }
//   });
// };

export const ResetExp = () => {
  auth().onAuthStateChanged(user => {
    if (user) {
      let uid = user.uid;
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

export const calculateMultiplayerExp = (difficulty: string, score: number) => {
  if (difficulty === 'easy') return Math.floor(0.05 * score);
  if (difficulty === 'intermediate') return Math.floor(0.1 * score);
  if (difficulty === 'hard') return Math.floor(0.15 * score);
};

export const MultiUpdateExp = async (exp: number) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    let userDataDocument = await firestore().collection('Users').doc(uid).get();
    let userData = userDataDocument.data();

    if (userData) {
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          exp: userData.exp + Math.floor(exp),
        });
    }
  }
};

export const calculateSingleplayerExp = (
  module: number,
  topic: number,
  score: number,
) => {
  return Math.floor(100 * score + module * topic * 10);
};

export const SingleUpdateExp = async (exp: number) => {
  let uid = auth().currentUser?.uid;
  if (uid) {
    let userDataDocument = await firestore().collection('Users').doc(uid).get();
    let userData = userDataDocument.data();

    if (userData) {
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          exp: userData.exp + exp,
        });
    }
  }
};

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

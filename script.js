const firebaseConfig = {
    apiKey: "AIzaSyCqZ5BnI9MZc_MAyl-JQ-WS5iaudCEuuK0",
    authDomain: "deepsea-e7c58.firebaseapp.com",
    databaseURL: "https://deepsea-e7c58-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "deepsea-e7c58",
    storageBucket: "deepsea-e7c58.appspot.com",
    messagingSenderId: "475654815752",
    appId: "1:475654815752:web:8d1526d3aeb48cf16a11bd",
    measurementId: "G-3J7F0FKW0K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()


// initialize data
var score = new Array(8);

var i = score.length;
console.log("user number: ", i);

for (k = 0; k < i; k++) {
download_data(k);
}

function download_data(userId) {

var docRef = db.doc(`users/${userId}`);

docRef.onSnapshot((doc) => {
    console.log(userId, "th user data:", doc.data().userId);
    score[userId] = doc.data().userId;
    document.getElementById('score_' + userId).textContent = score[userId];
});

}

// add
function add(userId) {
score[userId]++;
document.getElementById('score_' + userId).textContent = score[userId];

update_db(userId);
}

// minus
function minus(userId) {
score[userId]--;
document.getElementById('score_' + userId).textContent = score[userId];

update_db(userId);
}

// upload
function update_db(userId) {

const deviceDoc = db.doc(`users/${userId}`);

deviceDoc
    .set({
    userId: score[userId]
    })
    .then(() => console.log('Document successfully written!'))
    .catch(error => console.error('Error writing document: ', error))

}

/*
function update_log(userId) {

const deviceDoc = db.doc(`users/log`);
// get user ip

deviceDoc
    .set({
    string:
    })
    .then(() => console.log('Document successfully written!'))
    .catch(error => console.error('Error writing document: ', error))

}
*/
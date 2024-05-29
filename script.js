import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
    
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
//const analytics = getAnalytics(app);

document.getElementById("search_realtimeDB_Btn").addEventListener('click', function (e) {
    search_rtDB();
});

document.getElementById("search_Btn").addEventListener('click', function (e) {
    // 驗證是否有選擇
    var e1 = document.querySelector("#sea");
    var e2 = document.querySelector("#year");
    var e3 = document.querySelector("#month");
    let sea_num = e1.options[e1.selectedIndex].value;
    let year = e2.options[e2.selectedIndex].text;
    let month = e3.options[e3.selectedIndex].value;
    console.log(`sea: ${sea_num} /  year: ${year} / month: ${month}`);

    if (sea_num === "") {
        alert("請選擇海域");
    }
    else if (year === "請選擇年份") {
        alert("請選擇年份");
    }
    else if (month === "") {
        alert("請選擇月份");
    }
    else {
        search_DB(sea_num, year, month);
    }
});

function search_rtDB() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `sea1/2024`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
        console.error(error);
    });
}

function search_DB(sea_num, y, m) {
    const unsub = onSnapshot(doc(db, `sea${sea_num}`, `${y}${m}`), (doc) => {
        console.log("Current data: ", doc.data());
        if (doc.data() !== undefined) {
            var s = doc.data();
            console.log(s);
            alert("查詢成功！");

            document.getElementById('deepth').textContent = s.deepth;
            document.getElementById('temp').textContent = s.temp;
            document.getElementById('pH').textContent = s.pH;
            document.getElementById('ppt').textContent = s.ppt;
            document.getElementById('C').textContent = s.C;
            document.getElementById('SO').textContent = s.SO;
            document.getElementById('Na').textContent = s.Na;
            document.getElementById('K').textContent = s.K;
            document.getElementById('Ca').textContent = s.Ca;
            document.getElementById('Mg').textContent = s.Mg;
            document.getElementById('Cl').textContent = s.Cl;
            document.getElementById('Br').textContent = s.Br;
            document.getElementById('Cs').textContent = s.Cs;
            document.getElementById('B').textContent = s.B;
            document.getElementById('F').textContent = s.F;
        } else {
            alert("資料空白");
        }
    });

    /*
    docRef.onSnapshot((doc) => {
        
    });
    */
}

/*
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
*/
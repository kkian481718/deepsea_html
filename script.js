import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, deleteDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
    
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
const analytics = getAnalytics(app);

// ----------------------------------------------------------------

// Lab Data: Firestore
document.getElementById("search_Btn").addEventListener('click', function (e) {
    validate("#sea", "#year", "#month", "getLabData");
});

// Edit Data: Firestore
document.getElementById("search_Btn_edit").addEventListener('click', function (e) {
    validate("#sea_edit", "#year_edit", "#month_edit", "editLabData");
});

// Monitor Data: Realtime
document.getElementById("search_realtimeDB_Btn").addEventListener('click', function (e) {
    validate("#sea_rt", "#year_rt", "#month_rt", "getMonitorData");
});

document.getElementById("delete_Btn").addEventListener('click', function (e) {
    validate("#sea_edit", "#year_edit", "#month_edit", "deleteLabData");
});

document.getElementById("save_Btn").addEventListener('click', function (e) {
    validate("#sea_edit", "#year_edit", "#month_edit", "updateLabData");
});
// ----------------------------------------------------------------

// 驗證是否有正確選擇
async function validate(sel_id_sea, sel_id_year, sel_id_month, mode) {
    var e1 = document.querySelector(sel_id_sea);
    var e2 = document.querySelector(sel_id_year);
    var e3 = document.querySelector(sel_id_month);
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
        if (mode === "getLabData") {
            search_DB(sea_num, year, month, mode);
        }
        else if (mode === "getMonitorData") {
            search_rtDB(sea_num, year, month);
        }
        else if (mode === "editLabData") {
            let sea_text = e1.options[e1.selectedIndex].text;
            let month_text = e3.options[e3.selectedIndex].text
            search_DB(sea_num, year, month, mode, sea_text, month_text);
        }
        else if (mode === "deleteLabData") {
            await deleteDoc(doc(db, `sea${sea_num}`, `${year}${month}`));
            alert("刪除成功！");
        }
        else if (mode === "updateLabData") {
            const ref = doc(db, `sea${sea_num}`, `${year}${month}`);
            await setDoc(ref, {
                deepth: document.getElementById('deepth_edit').value,
                temp:   document.getElementById('temp_edit').value,
                pH:     document.getElementById('pH_edit').value,
                ppt:    document.getElementById('ppt_edit').value,
                C:      document.getElementById('C_edit').value,
                SO:     document.getElementById('SO_edit').value,
                Na:     document.getElementById('Na_edit').value,
                K:      document.getElementById('K_edit').value,
                Ca:     document.getElementById('Ca_edit').value,
                Mg:     document.getElementById('Mg_edit').value,
                Cl:     document.getElementById('Cl_edit').value,
                Br:     document.getElementById('Br_edit').value,
                Cs:     document.getElementById('Cs_edit').value,
                B:      document.getElementById('B_edit').value,
                F:      document.getElementById('F_edit').value
            });
            alert("新增成功！");
        }
    }
}

function search_DB(sea_num, y, m, mode, sea_text, month_text) {
    const unsub = onSnapshot(doc(db, `sea${sea_num}`, `${y}${m}`), async (docSnapshot) => {
        // DEBUG
        console.log("Current data: ", docSnapshot.data());

        if (docSnapshot.data() !== undefined) {
            var s = docSnapshot.data();

            if (mode === "getLabData") {
                update_text(s);
                alert("資料更新成功！");
            }
            else if (mode === "editLabData") {
                update_edit_text(s, sea_text, y, month_text);
                alert("資料更新成功！");
            }
        } else {
            alert("資料空白");
        }
    });
}

function search_rtDB(sea_num, y, m) {
    const day_Ref = ref(rtdb, `sea${sea_num}/${y}/${m}`);
    onValue(day_Ref, (snapshot) => {
        if (snapshot.val() === null) {
            alert("內容空白")
        } else {
            // 動態網頁內容
            let html_content = '';
            snapshot.forEach((childSnapshot) => {
                // 日
                const day = childSnapshot.key;
            
                const time_Ref = ref(rtdb, `sea${sea_num}/${y}/${m}/${day}`);
                onValue(time_Ref, (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        // time
                        const time = childSnapshot.key;
                        const humi = childSnapshot.val().humi;
                        const temp = childSnapshot.val().temp;

                        const list = document.querySelector('.list');
                        const domString =
                            `<li>
                                <div class="user">
                                    <button class="btn_add_woman">${day}</button>
                                    <p class="name_woman">${time}</p>
                                    <p class="score" id="deepth">${humi}% / ${temp}°C</p>
                                </div>
                            </li>`;
                        html_content += domString;
                        list.innerHTML = html_content;
                    });
                }, {
                    onlyOnce: false
                });
            });
        }
    }, {
        onlyOnce: false
    });
}

// ----------------------------------------------------------------

// 更新第一頁的實驗室數值
function update_text(s) {
    console.log("cool");
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
}

// 更新第三頁的編輯框數值、顯示儲存和刪除按鈕
function update_edit_text(s, sea_text, year, month_text) {
    document.getElementById('deepth_edit').value = s.deepth;
    document.getElementById('temp_edit').value = s.temp;
    document.getElementById('pH_edit').value = s.pH;
    document.getElementById('ppt_edit').value = s.ppt;
    document.getElementById('C_edit').value = s.C;
    document.getElementById('SO_edit').value = s.SO;
    document.getElementById('Na_edit').value = s.Na;
    document.getElementById('K_edit').value = s.K;
    document.getElementById('Ca_edit').value = s.Ca;
    document.getElementById('Mg_edit').value = s.Mg;
    document.getElementById('Cl_edit').value = s.Cl;
    document.getElementById('Br_edit').value = s.Br;
    document.getElementById('Cs_edit').value = s.Cs;
    document.getElementById('B_edit').value = s.B;
    document.getElementById('F_edit').value = s.F;

    document.getElementById('edit_tag').textContent = sea_text + "[" + year + "年 " + month_text + "月]";
}
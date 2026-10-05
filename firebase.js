// firebase.js - FINAL FIXED - Backup ALL Data
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiSDU3Lb9LLfRpAO9Hhg5LBZLrOEbcMY",
  authDomain: "mattara-food-product.firebaseapp.com",
  projectId: "mattara-food-product",
  storageBucket: "mattara-food-product.firebasestorage.app",
  messagingSenderId: "182858019306",
  appId: "1:182858019306:web:738ddb06940af2f8998293"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase Connected - MATTARA");
} catch (e) {
  console.error("Firebase Error:", e);
}

window.backupToFirebase = async () => {
  if (!db) return alert("Firebase not ready");
  try {
    // Backup ENTIRE localStorage - all keys
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allData[key] = localStorage.getItem(key);
    }
    if (Object.keys(allData).length === 0) return alert("No data in this browser to backup!");

    await setDoc(doc(db, "mattara", "backup"), {
      allData: JSON.stringify(allData),
      time: new Date().toISOString(),
      keys: Object.keys(allData)
    });
    alert("✅ SUCCESS! Backup saved!\nKeys backed up: " + Object.keys(allData).join(", "));
  } catch(err){ alert("Backup failed: " + err.message); console.error(err); }
};

window.restoreFromFirebase = async () => {
  if (!db) return alert("Firebase not ready");
  try {
    const snap = await getDoc(doc(db, "mattara", "backup"));
    if (snap.exists()) {
      const backup = snap.data();
      if (confirm("Restore from Cloud?\nBackup time: " + backup.time + "\nKeys: " + backup.keys + "\n\nContinue?")) {
        const allData = JSON.parse(backup.allData);
        for (const key in allData) {
          localStorage.setItem(key, allData[key]);
        }
        alert("✅ Restored! Page will reload.");
        location.reload();
      }
    } else {
      alert("No backup found in cloud. Do backup first.");
    }
  } catch(err){ alert("Restore failed: " + err.message); }
};

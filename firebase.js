// firebase.js - FINAL - MATTARA FOOD PRODUCT
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

// Backup: type backupToFirebase() in console
window.backupToFirebase = async () => {
  if (!db) return alert("Firebase not ready");
  const data = localStorage.getItem('mattaraDB');
  if (!data) return alert("No local data found to backup!");
  try {
    await setDoc(doc(db, "mattara", "backup"), { 
      data: data, 
      time: new Date().toISOString(),
      device: navigator.userAgent
    });
    alert("✅ Backup saved to Firebase Cloud!");
  } catch(err){ alert("Backup failed: " + err.message); }
};

// Restore: type restoreFromFirebase() in console
window.restoreFromFirebase = async () => {
  if (!db) return alert("Firebase not ready");
  try {
    const snap = await getDoc(doc(db, "mattara", "backup"));
    if (snap.exists()) {
      if (confirm("Restore from Cloud? Last backup: " + snap.data().time + "\nThis will replace local data. Continue?")) {
        localStorage.setItem('mattaraDB', snap.data().data);
        alert("✅ Restored! Page will reload.");
        location.reload();
      }
    } else {
      alert("No backup found in cloud. Do backupToFirebase() first.");
    }
  } catch(err){ alert("Restore failed: " + err.message); }
};

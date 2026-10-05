// firebase.js - SAFE VERSION - Won't break login
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase Connected Successfully");
} catch (e) {
  console.log("Firebase config not set yet - app will still work", e);
}

// Call this from console to backup: backupToFirebase()
window.backupToFirebase = async () => {
  if (!db) return alert("Please setup Firebase config first!");
  const data = localStorage.getItem('mattaraDB') || localStorage.getItem('data');
  if (!data) return alert("No data to backup");
  await setDoc(doc(db, "mattara", "backup"), { 
    data: data, 
    time: new Date().toISOString() 
  });
  alert("✅ Backup saved to Firebase Cloud!");
};

// Call this from console to restore: restoreFromFirebase()
window.restoreFromFirebase = async () => {
  if (!db) return alert("Please setup Firebase config first!");
  const snap = await getDoc(doc(db, "mattara", "backup"));
  if (snap.exists()) {
    if (confirm("Restore from Cloud? This will replace local data.")) {
      const cloudData = snap.data().data;
      localStorage.setItem('mattaraDB', cloudData);
      alert("✅ Restored! Reloading...");
      location.reload();
    }
  } else {
    alert("No backup found in cloud");
  }
};

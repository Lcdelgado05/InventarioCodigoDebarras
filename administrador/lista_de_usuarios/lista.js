// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js"; // Importa Firebase Analytics

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCP4k5lHPNHP4lC9OQ0aVTIZXs8TdwGExo",
    authDomain: "market-c81bf.firebaseapp.com",
    projectId: "market-c81bf",
    storageBucket: "market-c81bf.appspot.com",
    messagingSenderId: "377839139498",
    appId: "1:377839139498:web:77b36c4c0ef679a420eed3",
    measurementId: "G-XLQJX76C67"
  };


// Obtiene una referencia a la colección 'usuarios' en Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usuariosRef = collection(db, 'usuarios');

// Obtiene la referencia al elemento HTML de la tabla de usuarios
const tablaUsuarios = document.getElementById('tabla-usuarios').getElementsByTagName('tbody')[0];

// Obtiene la lista de usuarios y los agrega a la tabla HTML
getDocs(usuariosRef).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const usuario = doc.data();
    const row = tablaUsuarios.insertRow();
    const cellNombre = row.insertCell(0);
    const cellCorreo = row.insertCell(1);
    const cellRol = row.insertCell(2);

    cellNombre.textContent = usuario.Nombre;
    cellCorreo.textContent = usuario.correo;
    cellRol.textContent = usuario.rol;
  });
});

// Archivo: registro.js

// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
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





// Inicializa Firebase y obtén referencias a los servicios necesarios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app); // Inicializa Firebase Analytics

// Agrega un evento de escucha para el formulario de registro
document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault();
  registrarUsuario();
});

function registrarUsuario() {
  const Correo = document.getElementById("correo").value;
  const Contrasena = document.getElementById("contrasena").value;
  const rol = document.getElementById("rol").value;

  // Registra al usuario en Firebase Authentication
  createUserWithEmailAndPassword(auth,Correo,Contrasena)
    .then((userCredential) => {
      // Registro exitoso, ahora podemos agregar información adicional a Firestore
      const usuario = {
        Correo: Correo,
        rol: rol,
        Contrasena: Contrasena, 
      };

      // Agregar información del usuario a Firestore en la colección "usuarios"
      setDoc(doc(db, "usuarios",Correo,rol,Contrasena), usuario)
        .then(() => {
          console.log("Usuario registrado exitosamente");
          // Puedes redirigir o hacer otras acciones después del registro
        })
        .catch((error) => {          console.error("Error al agregar información del usuario a Firestore: ", error);
        });
    })

}


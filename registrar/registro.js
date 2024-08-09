import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCP4k5lHPNHP4lC9OQ0aVTIZXs8TdwGExo",
    authDomain: "market-c81bf.firebaseapp.com",
    projectId: "market-c81bf",
    storageBucket: "market-c81bf.appspot.com",
    messagingSenderId: "377839139498",
    appId: "1:377839139498:web:77b36c4c0ef679a420eed3",
    measurementId: "G-XLQJX76C67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    registrarUsuario();
});

async function registrarUsuario() {
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const rol = document.getElementById("rol").value;
    const nombre = document.getElementById("nombre").value;
    const numeroContacto = document.getElementById("numeroContacto").value;

    // Validar que todos los campos estén diligenciados
    if (!correo || !contrasena || !rol || !nombre || !numeroContacto) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Validar formato de correo mediante una expresión regular
    const correoValido = validarCorreo(correo);

    if (!correoValido) {
        alert("Ingrese un correo válido.");
        return;
    }

    // Validar si el correo ya está en uso
    const correoEnUso = await correoEstaEnUso(correo);

    if (correoEnUso) {
        alert("El correo ya está en uso. Por favor, elija otro.");
        return;
    }

    try {
        // Agrega información del usuario a Firestore con un ID único generado por Firebase
        const clienteDocRef = await addDoc(collection(db, "Clientes"), {
            Correo: correo,
            rol: rol,
            Nombre: nombre,
            Telefono: numeroContacto,
            Contraseña: contrasena,
        });

        console.log("Usuario registrado exitosamente");

        // Verifica si el rol del usuario es "usuario" antes de generar un ID de Inventario y crear un documento
        if (rol === "usuario") {
            // Genera un ID aleatorio para el nuevo documento en la colección "Inventario"
            const idInventario = generateRandomId();

            // Crea un documento en la colección "Inventario" con el ID aleatorio
            await setDoc(doc(db, "Inventario", idInventario), {
                // Puedes agregar la información específica de Inventario aquí si es necesario
                // ...
            });

            // Actualiza el documento del cliente con el ID de Inventario
            await updateDoc(clienteDocRef, {
                IdInventario: idInventario,
            });

            console.log("Archivo en Inventario creado exitosamente");
        }

        // Mostrar aviso de registro exitoso
        alert("Registro exitoso. ¡Bienvenido!");

        // Borrar los campos después de un registro exitoso
        document.getElementById("correo").value = "";
        document.getElementById("contrasena").value = "";
        document.getElementById("rol").value = "usuario";
        document.getElementById("nombre").value = "";
        document.getElementById("numeroContacto").value = "";

    } catch (error) {
        console.error("Error al registrar usuario en Firebase Authentication: ", error);
    }
}

function validarCorreo(correo) {
    // Expresión regular para validar formato de correo electrónico
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
}

async function correoEstaEnUso(correo) {
    const q = query(collection(db, "Clientes"), where("Correo", "==", correo));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Función para generar un ID aleatorio
function generateRandomId() {
    // Puedes personalizar la lógica para generar un ID aleatorio según tus necesidades
    // En este ejemplo, se utiliza un timestamp combinado con un número aleatorio
    return Date.now().toString() + Math.floor(Math.random() * 10000).toString();
}

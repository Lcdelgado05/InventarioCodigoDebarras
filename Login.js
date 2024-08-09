// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', function () {
    const Correo = document.getElementById('Correo');
    const Contraseña = document.getElementById('contraseña');
    const button = document.getElementById('button');

    button.addEventListener('click', async (e) => {
        e.preventDefault();

        const emailValue = Correo.value.trim();
        const passwordValue = Contraseña.value.trim();

        // Inicializa Firebase
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);

        try {
            // Construye una referencia a la colección "Clientes"
            const clientesCollection = collection(firestore, 'Clientes');

            // Consulta la colección para verificar el Correo y la contraseña
            const q = query(clientesCollection, where('Correo', '==', emailValue), where('Contraseña', '==', passwordValue));
            const querySnapshot = await getDocs(q);

            // Verifica si existe un usuario con el correo y la contraseña proporcionados
            if (querySnapshot.empty) {
                console.error("Inicio de sesión fallido: Correo o Contraseña incorrectos");
            } else {
                // Usuario ha iniciado sesión correctamente
                const userData = querySnapshot.docs[0].data();

                // Verifica el rol del usuario y redirige según el rol
                if (userData.rol === 'usuario') {
                    // Guarda el ID de inventario en el localStorage
                    localStorage.setItem('idInventario', userData.idInventario);

                    // Redirige a la página de clientes
                    window.location.href = 'Usuario.html';
                } else if (userData.rol === 'administrador') {
                    // Redirige a la página de administrador
                    window.location.href = 'Administrador.html';
                } else {
                    console.error("Inicio de sesión fallido: Rol desconocido");
                }
            }
        } catch (error) {
            console.error("Error de inicio de sesión:", error.message);
        }
    });
});

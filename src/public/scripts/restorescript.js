// Función para actualizar la contraseña de un usuario por correo electrónico
async function updatePassUserByEmail(email, newPassword) {
    try {
        const updateData = {
            email: email,
            password: newPassword,
        };

        const userResponse = await fetch(`/users/search/${email}`, {
            method: "GET",
        });
        const userData = await userResponse.json();
        if (!userData || !userData.payload || !userData.payload._id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Usuario no encontrado`,
            }).then(() => {
                window.location.href = "/register";
            });
            return;
        }

        const uid = userData.payload._id;

        // Realizar la solicitud PUT
        const url = `/users/${uid}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Usuario Actualizado",
                    text: `Password de usuario ${email} actualizada Exitosamente`,
                }).then(() => {
                    window.location.href = "/";
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `No se pudo Actualizar el usuario`,
                }).then(() => {
                    window.location.href = "/";
                });
            }
        } else {
            console.error("Error al actualizar el usuario:", response.status);
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
    }
}

// Escucho formulario de actualización de contraseña
document.getElementById("updatePass").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("password").value;

    // Llamar a la función para actualizar la contraseña
    await updatePassUserByEmail(email, newPassword);
});
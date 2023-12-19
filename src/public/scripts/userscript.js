// Función para actualizar el usuario
async function updateUser(user) {
    try {
        const uid = user._id;

        // Obtener los datos actualizados del formulario
        const roleUpdateInput = document.getElementById("roleUpdate");
        if (!roleUpdateInput) {
            console.error("Elemento no encontrado: roleUpdate");
            return;
        }

        const roleUpdateValue = roleUpdateInput.value;
        const updatedUser = {
            email: user.email,
            role: roleUpdateValue,
        };
        const url = `/users/${uid}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Usuario Actualizado",
                    text: `Usuario ${user.email} Actualizado Exitosamente al rol: ${updatedUser.role}`,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `No se pudo Actualizar el usuario`,
                });
            }
        } else {
            console.error("Error al actualizar el usuario:", response.status);
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
    }
}

// Función para Eliminar el usuario
async function deleteUser(_id){
    const deleteId = _id; // Obtener el ID del usuario
    
    try {
        const response = await fetch(`/users/${deleteId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Usuario eliminado",
                text: `El usuario con ID ${deleteId} ha sido eliminado exitosamente`,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `No se pudo eliminar el usuario con ID ${deleteId}`,
            });
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
}

// Buscar Usuario por EMAIL
const findFormEmail = document.getElementById("find-form-email");
if (findFormEmail) {
    findFormEmail.addEventListener("submit", async (e) => {
        e.preventDefault();
        const findEmail = document.getElementById("find-email").value;
        const resultContainer = document.getElementById("search-result-email");

        try {
            const response = await fetch(`/users/search/${findEmail}`, {
                method: "GET",
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.result === "success") {
                    const user = data.payload;
                    resultContainer.innerHTML = `
                    <h2>Detalles del Usuario</h2>
                    <label for="email"><strong>Email:</strong></label>
                    <input type="email" id="emailUpdate" value="${user.email}" readonly>
                    <label for="role"><strong>Rol:</strong></label>
                    <select id="roleUpdate">
                    <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                    <option value="premium" ${user.role === "premium" ? "selected" : ""}>Premium</option>
                    </select>
                    <p><strong>ID:</strong> ${user._id}</p>
                    <button id="update-button-user">Actualizar</button>
                    <button id="delete-button-user">Eliminar</button>
                    `;
                    // Botón "Actualizar"
                    const updateButton = document.getElementById("update-button-user");
                    if (updateButton) {
                        updateButton.addEventListener("click", async () => {
                            updateUser(user);
                        });
                    }

                    // Botón "Eliminar"
                    const deleteButton = document.getElementById("delete-button-user");
                    if (deleteButton) {
                        deleteButton.addEventListener("click", async () => {
                            deleteUser(user._id);
                        });
                    }
                } else {
                    // Usuario no encontrado
                    resultContainer.innerHTML = "<p>Usuario no encontrado.</p>";
                }
                document.getElementById('find-email').value = ""; // Limpiar el campo de búsqueda
            } else {
                console.error("Error al buscar el usuario:", response.status);
            }
        } catch (error) {
            console.error("Error al buscar el usuario:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al obtener el usuario.",
            });
        }
    });
}

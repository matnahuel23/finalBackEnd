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

// Función para buscar todos los usuarios
async function findAllUsers() {
    const resultContainer = document.getElementById("search-result-email");

    try {
        const response = await fetch(`/users`, {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            if (data.result === "success") {
                const users = data.payload;
                if (users.length > 0) {
                    resultContainer.innerHTML = `
                    <h2>Lista de Usuarios</h2>
                    <ul>
                        ${users.map(user => `<li>${user.email} - Rol: ${user.role}</li>`).join('')}
                    </ul>
                    `;
                } else {
                    resultContainer.innerHTML = "<p>No se encontraron usuarios.</p>";
                }
            } else {
                console.error("Error al obtener la lista de usuarios:", data.error);
            }
        } else {
            console.error("Error al obtener la lista de usuarios:", response.status);
        }
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al obtener la lista de usuarios.",
        });
    }
}

// Obtener el botón "Buscar Todos"
const findAllUsersButton = document.getElementById("find-all-users");

// Verificar si el botón existe antes de asignar el evento clic
if (findAllUsersButton) {
    findAllUsersButton.addEventListener("click", async () => {
        await findAllUsers();
    });
}

// Obtener el botón "Limpiar"
const clearSearchButton = document.getElementById("clear-search");

// Verificar si el botón existe antes de asignar el evento clic
if (clearSearchButton) {
    clearSearchButton.addEventListener("click", async () => {
        // Realizar la solicitud DELETE a la ruta /users/clear
        try {
            const clearResponse = await fetch(`/users/clear`, {
                method: "DELETE",
            });
            console.log(clearResponse)
            if (clearResponse.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminacion de Usuarios",
                    text: "Los usuarios inactivos han sido eliminados exitosamente.",
                });
            } else {
                console.error("Error al eliminar usuarios inactivos:", clearResponse.status);
            }
        } catch (error) {
            console.error("Error al eliminar usuarios inactivos:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar usuarios inactivos.",
            });
        }
    });
}
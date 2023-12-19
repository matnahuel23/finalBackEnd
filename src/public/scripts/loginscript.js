function showIncorrectPasswordAlert() {
    Swal.fire({
        icon: 'error',
        title: 'Contraseña incorrecta',
        text: 'La contraseña ingresada es incorrecta.'
    });
}

function showUserNotFoundAlert() {
    Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado',
        text: 'El usuario no existe. Regístrate para crear una cuenta.'
    });
}

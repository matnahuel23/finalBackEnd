$(document).ready(function () {
    // Intercepta la presentación del formulario
    $('#documentForm').submit(function (e) {
        e.preventDefault();

        // Realiza la solicitud AJAX
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                // Muestra un SweetAlert de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El archivo se subió correctamente.',
                });
            },
            error: function (xhr, status, error) {
                // Muestra un SweetAlert de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo subir el archivo. Inténtalo de nuevo.',
                });
            }
        });
    });

    // Maneja el cambio en el tipo de archivo seleccionado
    $('input[name="fileType"]').change(function () {
        // Actualiza el valor del campo oculto
        $('#fileTypeName').val($(this).val());
    });
});

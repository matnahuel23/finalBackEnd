## :hammer:Entrega final de BackEnd!!!

* http://localhost:8080/ 

* Usuario de pruebas

user: user@test.com
password: 1

ADMIN
user: adminCoder@coder.com 
password: 1


![Badge en Desarollo](https://img.shields.io/badge/ESTADO-DE%20CONEXIÓN-green)


* La últma conexión del usuario que se actualiza con LOGIN o LOGOUT.

![last connection](src/public/prints/1-last_connection.png)


![Badge en Desarollo](https://img.shields.io/badge/CARGA-DE%20DOCUMENTOS-yellow)


* Desde la vista de productos el usuario tiene disponible el botón "Documentos" que le permite subir los documentos necesarios para luego habilitar ser Premium.

![elijo opcion cargar documentos](src/public/prints/2-opcion_documentos.png)

* Una vez en la vista "Documentos" con el radio button elijo una opción de tipo de documento que voy a subir para luego asi subirlo.

![cargo 1 documento](src/public/prints/3-carga_documentos.png)

* Si aún no he subido ningún documento, ni cree una carpeta, gracias a Multer se creara sola la carpeta destinada a documentos. Tambien esta preparada la app, para crear otras carpetas para productos o fotos de perfil en caso de que sea necesario.

![no hay carpeta para los documentos](src/public/prints/4-archivos%20antes%20de%20cargar%20doc.png)

* Tengo notificación de correcta subida del documento.

![agrego un documento OK](src/public/prints/5-cargo%20un%20archivo%20OK.png)

* Una vez que subi el documento se ve como se creo sola la carpeta para estos.

![se crea sola la carpeta para documentos](src/public/prints/6-archivos%20post%20carga%20crea%20carpeta%20sino%20existe.png)

* Mongo se actualiza correctamente con el documento subido.

![se carga en MONGO](src/public/prints/7-carga%20ok%20de%20doc%20en%20mongo%20con%20name%20y%20reference.png)


![Badge en Desarollo](https://img.shields.io/badge/SER-USER%20PREMIUM-blue)

* Desde la vista "Documentos" siempre tengo disponible el botón "SER PREMIUM" pero en caso de no cumplir la condición de subir por lo menos un documento de cada uno de los tres disponibles, me dará error al apretarlo y no permitirá el Upgrade.

![condiciones insuficientes para Ser Premium](src/public/prints/8-condicion%20insuficiente%20para%20Ser%20Premium.png)

* Si cumplo con las condiciones previamente mencionadas, tendré la notificación del correcto Upgrade de role.

![cumple condicion de 3 documentos distintos](src/public/prints/9-condicion%20Ok%20necesario%203%20documentos%20distintos%20cargados.png)

* Mongo actualizo OK el rol de "user" a "premium"

![se actualiza MONGO con nuevo rol](src/public/prints/10-user%20premium%20ahora%20en%20mongo%20OK.png)

* Nuevo acceso premium disponible

![acceso premium](src/public/prints/11-usuario%20con%20acceso%20premium.png)

* Permisos premium

![permisos premium](src/public/prints/12-permisos%20premium.png)
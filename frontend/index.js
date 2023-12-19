fetch('http://localhost:8080/users')
  .then(result => result.json())
  .then(data => {
    const users = data.payload;

    if (Array.isArray(users)) {
      const fragment = document.createDocumentFragment();

      users.forEach(user => {
        const div = document.createElement("div");
        const firstNameParagraph = document.createElement("p");
        const lastNameParagraph = document.createElement("p");
        const email = document.createElement("p");
        const roleParagraph = document.createElement("p");

        firstNameParagraph.innerHTML = `Nombre : ${user.first_name}`;
        lastNameParagraph.innerHTML = `Apellido : ${user.last_name}`;
        email.innerHTML = `Email : ${user.email}`;
        roleParagraph.innerHTML = `Rol : ${user.role}`;
        div.appendChild(email);
        div.appendChild(firstNameParagraph);
        div.appendChild(lastNameParagraph);
        div.appendChild(roleParagraph);
        fragment.append(div);
      });

      const usersContainer = document.getElementById("users");
      usersContainer.appendChild(fragment);
    } else {
      const errorParagraph = document.createElement("p");
      errorParagraph.innerHTML = "No se encontraron usuarios.";
      const usersContainer = document.getElementById("users");
      usersContainer.appendChild(errorParagraph);
    }
  })
  .catch(error => {
    console.error("Error al obtener datos:", error);
  });

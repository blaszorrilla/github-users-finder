$(document).ready(function () {
    const btnSearch = $(".search-section button");
    const inputUser = $(".search-section input");
    const mainContainer = $(".main-wraper");
    const containerSection = $(".container-section");

    const url = "https://api.github.com/users/";
// Evento de clic en el botón de búsqueda
    btnSearch.on("click", function (e) {
        e.preventDefault();
        // Validar que el campo de entrada no esté vacío
        if (inputUser.val() === "") {
            mostrarError("Escriba un usuario de GitHub...");
            return;
        }
// Realiza la búsqueda del usuario en GitHub
        callApiUser(inputUser.val());
    });
//Evento de presionar la tecla "Enter" en el campo de entrada
     inputUser.on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
             callApiUser(inputUser.val());
        }
    });
// Función para realizar la llamada a la API de GitHub y procesar los resultados
    function callApiUser(user) {
        const userUrl = url + user;
        const repoUrl = `${url}${user}/repos`;

        $.when(
            $.ajax({ url: userUrl }),
            $.ajax({ url: repoUrl })
        )
            .done(function (userData, repoData) {
                const dataUser = userData[0];
                const dataRepo = repoData[0];

                // Mostrar la información del usuario y sus repositorios
                mostrarData(dataUser);
                mostrarRepos(dataRepo);

            })
            .fail(function (error) {
                // Manejar el caso en que el usuario no existe
                if (error.status === 404) {
                    mostrarError("No existe el usuario...");
                    //return;
                }else{
                     console.log(error);
                } 
            });
    }
// Función para mostrar la información del usuario en la interfaz
    function mostrarData(dataUser) {
        clearHTML();
        const {
            avatar_url,
            bio,
            followers,
            following,
            name,
            public_repos,
        } = dataUser;
        const container = $("<div>").html(`
            <div class="row-left">
                <img src="${avatar_url}" alt="user image">
            </div>
            <div class="row-right">
                <h3>${name}</h3>
                <p>${bio}</p>
                <div class="stats-user">
                    <p>${followers} <span>Followers</span></p>
                    <p>${following} <span>Following</span></p>
                    <p>${public_repos} <span>Repos</span></p>
                </div>
                <h3>Repositorios:</h3>
                <div class="link-repos"></div>
            </div>
        `);
        containerSection.append(container);
    }
// Función para mostrar la lista de repositorios en la interfaz
    function mostrarRepos(repos) {
        const reposContainer = $(".link-repos");
        repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 10)
            .forEach((element) => {
                const link = $("<a>")
                    .text(element.name)
                    .attr("href", element.html_url)
                    .attr("target", "_blank");
                reposContainer.append(link);
            });
    }
// Función para mostrar mensajes de error en la interfaz
    function mostrarError(mensaje) {
        const mensajeNuevo = "Advertencia: " + mensaje;
        const error = $("<h5>")
            .text(mensajeNuevo)
            .css("color", "red");
        mainContainer.append(error);
        setTimeout(() => error.remove(), 5000);
    }
 // Función para limpiar el contenido HTML en el contenedor de repositorios
    function clearHTML() {
        containerSection.html("");
    }
});

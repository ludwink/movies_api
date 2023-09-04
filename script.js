
// INTERACCIONES API
// OPTIONS DE LA API
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
  }
};

// OBTENER IDIOMAS
async function obtenerIdiomas() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/configuration/languages', apiOptions);
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de idiomas');
    }
    const languages = await response.json();
    return languages;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// OBTENER GENEROS
async function obtenerGeneros() {
  var idioma = document.getElementById("idioma").value;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${idioma}`, apiOptions);
    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de generos");
    }
    const data = await response.json();
    return data.genres;
  } catch (err) {
    console.log("ERROR: " + err);
    throw err;
  }
}

async function obtenerPeliculasPorGenero(pagina) {
  var idioma = document.getElementById("idioma").value;
  var genero = document.getElementById("generos").value;

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${idioma}&page=${pagina}&sort_by=popularity.desc&with_genres=${genero}`, apiOptions);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("ERRPR AL OBTENER LAS PELICULAS POR GENERO" + err);
    throw err;
  }
}

// MOSTRAR IDIOMAS EN <SELECT> HTML
async function mostrarIdiomas() {
  try {
    const languages = await obtenerIdiomas();
    const opcionesIdioma = document.getElementById('idioma');
    const usuarioIdioma = navigator.language.split('-')[0];

    languages.forEach(language => {
      // Mostrar listado de Idiomas
      const option = document.createElement('option');
      option.value = language.iso_639_1;
      option.textContent = (language.name) ? `${language.english_name} - ${language.name}` : language.english_name;
      // Selecciona la opción del idioma del sistema
      if (language.iso_639_1 === usuarioIdioma) {
        option.selected = true;
      }
      opcionesIdioma.appendChild(option);
    });
  } catch (err) {
    console.error("ERROR AL MOSTRAR IDIOMAS" + err);
  }
}

// MOSTRAR GENEROS EN <SELECT> HTML
async function mostrarGeneros() {
  try {
    const selectGeneros = document.getElementById('generos');
    const generos = await obtenerGeneros();

    generos.forEach(genero => {
      const option = document.createElement('option');
      option.value = genero.id;
      option.textContent = genero.name || "Not Found";
      selectGeneros.appendChild(option);
    });

  } catch (error) {
    console.error("ERROR AL MOSTRAR GENEROS: " + error);
  }
}

async function mostrarPeliculasPorGenero(accion) {
  // Paginacion
  if (accion === "inicio") {
    pagina = 1;
  } else if (accion === "siguiente") {
    pagina++;
  } else if (accion === "anterior" && pagina > 1) {
    pagina--;
  } else {
    console.error("ERROR AL ENVIAR EL NUMERO DE PAGINA, ACCION NO VALIDA");
    return;
  }

  // Eliminar peliculas anteriores
  var contenedorPeliculas = document.getElementById("contenedorPeliculas");
  while (contenedorPeliculas.firstChild) {
    contenedorPeliculas.removeChild(contenedorPeliculas.firstChild);
  }

  try {
    const nombreGeneros = await obtenerGeneros();
    const peliculas = await obtenerPeliculasPorGenero(pagina);

    // Agregar nombre del genero en lugar del ID
    const peliculasConGenero = peliculas.results.map(movie => {
      const genreNames = movie.genre_ids.map(genreId => {
        const genre = nombreGeneros.find(genre => genre.id === genreId);
        return genre ? genre.name : "Desconocido";
      });
      return {
        ...movie,
        genre_names: genreNames
      };
    });
    mostrarPeliculas(peliculasConGenero);

  } catch (error) {
    console.error('ERROR PELICUAS POR GENERO: ', error);
  }
}

// MOSTRAR LAS PELICULAS EN EL HTML
function mostrarPeliculas(peliculas) {
  const contenedorPeliculas = document.querySelector('.contenedorPeliculas');

  peliculas.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${movie.poster_path}')`;
    //card.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg')`;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const title = document.createElement('h2');
    title.textContent = movie.title;
    overlay.appendChild(title);

    const releaseDate = document.createElement('h3');
    releaseDate.textContent = `${movie.release_date}`;
    overlay.appendChild(releaseDate);

    const genreNames = document.createElement('h4');
    genreNames.textContent = `${movie.genre_names.join(', ')}`;
    overlay.appendChild(genreNames);

    const overview = document.createElement('p');
    overview.textContent = movie.overview;
    overlay.appendChild(overview);

    card.appendChild(overlay);
    contenedorPeliculas.appendChild(card);
  });
}

// CARGAR IDIOMAS, GENEROS Y PELICULAS AL INICIO, EN ESE ORDEN
mostrarIdiomas().then(() => mostrarGeneros()).then(() => mostrarPeliculasPorGenero('inicio'));

// CAMBIAR PELICULAS AL SELECCIONAR GENERO
generos.addEventListener('change', () => {
  mostrarPeliculasPorGenero("inicio");
});

// CAMBIAR PELICULAS AL SELECCIONAR IDIOMA
idioma.addEventListener('change', () => {
  // Limpiar generos cargados anteriormente
  var selectElement = document.getElementById('generos');
  selectElement.innerHTML = '';
  // --------------------------------------

  mostrarGeneros();
  mostrarPeliculasPorGenero("inicio");
});

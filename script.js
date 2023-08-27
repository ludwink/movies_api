
// OPTIONS DE LA API
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
  }
};

// OBTENER LENGUAJES
const opcionesIdioma = document.getElementById('idioma');
const usuarioIdioma = navigator.language.split('-')[0];

fetch('https://api.themoviedb.org/3/configuration/languages', apiOptions)
  .then(response => response.json())
  .then(languages => {
    languages.forEach(language => {
      const option = document.createElement('option');
      option.value = language.iso_639_1;
      option.textContent = language.english_name || language.name;

      // Selecciona la opción del idioma del sistema
      if (language.iso_639_1 === usuarioIdioma) {
        option.selected = true;
      }
      opcionesIdioma.appendChild(option);
    });
  })
  .catch(err => console.error(err));

// OBTENER EL GENERO DE LAS PELICULAS
// Retorna un array, para poder hacer las referencias al obtener las peliculas
// Las peliculas solo tienen el ID del genero, pero no el nombre
async function obtenerGeneros() {
  var idioma = document.getElementById("idioma").value;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${idioma}`, apiOptions);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// OBTENER PELICULAS POPULARES
var pagina = 1;
async function obtenerPeliculasPopulares(accion) {
  if (accion === "inicio") {
    pagina = 1;
  } else if (accion === "siguiente") {
    pagina++;
  } else if (accion === "anterior" && pagina > 1) {
    pagina--;
  } else {
    console.error("Acción no válida");
    return;
  }

  // Eliminar peliculas anteriores
  var contenedorPeliculas = document.getElementById("contenedorPeliculas");
  while (contenedorPeliculas.firstChild) {
    contenedorPeliculas.removeChild(contenedorPeliculas.firstChild);
  }

  try {
    const nombreGeneros = await obtenerGeneros();
    var idioma = document.getElementById("idioma").value;
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=${idioma}&page=${pagina}`, apiOptions);
    const responseData = await response.json();

    const popularMovies = responseData.results.map(movie => {
      const genreNames = movie.genre_ids.map(genreId => {
        const genre = nombreGeneros.find(genre => genre.id === genreId);
        return genre ? genre.name : "Desconocido";
      });
      return {
        ...movie,
        genre_names: genreNames
      };
    });

    mostrarPeliculas(popularMovies);
  } catch (error) {
    console.error(error);
  }
}

// CARGAR PELICULAS AL INICIO
obtenerPeliculasPopulares("inicio");

// MOSTRAR LAS PELICULAS EN EL HTML
function mostrarPeliculas(popularMovies) {
  const contenedorPeliculas = document.querySelector('.contenedorPeliculas');

  popularMovies.forEach(movie => {
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

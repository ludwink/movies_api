

// OPTIONS DE LA API
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
  }
};

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
async function obtenerPeliculasPopulares() {
  // Eliminar peliculas anteriores
  var contenedorPeliculas = document.getElementById("contenedorPeliculas");
  while (contenedorPeliculas.firstChild) {
    contenedorPeliculas.removeChild(contenedorPeliculas.firstChild);
  }

  var idioma = document.getElementById("idioma").value;
  var pagina = 1;

  try {
    const nombreGeneros = await obtenerGeneros();

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

[
  {
    "iso_639_1": "xx",
    "english_name": "No Language",
    "name": "No Language"
  },
  {
    "iso_639_1": "aa",
    "english_name": "Afar",
    "name": ""
  }
]


// FUNCION PARA OBTENER LOS GENEROS EN INGLES O ESPAÑOL
// DEBIDO A QUE EN LA URL DEL GENERO EL IDIOMA SE DEFINE COMO "es" o "en"
// Y EN LA URL DE PELICULAS POPULARES SE DEFINE COMO "es-ES" o "en-US"
// Y EN EL HTML LOS VALUES DEL SELECT ESTAN "es-ES" y "en-US"
function idiomaGenero() {
  var idioma = document.getElementById("idioma").value;
  var idiomaGenero = "";

  if (idioma === "en-US") {
    idiomaGenero = "en";
  } else if (idioma === "es-ES") {
    idiomaGenero = "es";
  }
  return idiomaGenero;
}

// OBTENER EL GENERO DE LAS PELICULAS, EN INGLES O ESPAÑOL
// RETORNA UN ARRAY, PARA PODER HACER LAS REFERENCIAS AL OBTENER LAS PELICULAS
// LAS PELICULAS SOLO TRAEN EL ID DEL GENERO, PERO NO EL NOMBRE
async function obtenerGeneros() {
  const generoPeliculaOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${idiomaGenero()}`, generoPeliculaOptions);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// OBTENER PELICULAS POPULARES
async function obtenerPeliculasPopulares() {
  const popularMoviesOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
    }
  };

  var idiomaPelis = document.getElementById("idioma").value;
  var pagina = 1;
  try {
    const nombreGeneros = await obtenerGeneros();

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=${idiomaPelis}&page=${pagina}`, popularMoviesOptions);
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

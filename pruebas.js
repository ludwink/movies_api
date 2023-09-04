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
  },
  {
    "iso_639_1": "af",
    "english_name": "Afrikaans",
    "name": "Afrikaans"
  },
]

// OBTENER PELICULAS POPULARES
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

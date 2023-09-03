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

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGY2MzkwMzUxN2E0YTUwNTA5ZGViOTAxZjgzODk3YyIsInN1YiI6IjYxYjZjMWVhYzk5NWVlMDA0MjUxNTdiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G8KkdOspFQZuvVyHp4jQvyiYCBhqybx8TeShkqWYZT4'
  }
};

fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=1&sort_by=popularity.desc&with_genres=18', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

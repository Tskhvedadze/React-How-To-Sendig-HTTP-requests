import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  // Add Loading Data 
  const [isLoading, setIsLoading] = useState(false);

  // Error Handler
  const [error, setError] = useState(null);

  //** Using async / await which is another JS built - in features
  //** Wich is more flexible and easy way then fetch() and then() - chaining method

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://swapi.dev/api/films');

      if (res.status !== 200) {
        throw new Error('Something went wrong');
      }

      const data = await res.json();

      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseData: movieData.release_data
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false);
  }


  //** Here we are using JS fetch() method and then() chaining features 
  //** to transofrm responses JSON formated code such like JS object to 
  //** react them and fetch the date just we want to display in the browser

  // const fetchMoviesHandler = () => {
  //   fetch('https://swapi.dev/api/films').then(res => {
  //     return res.json()
  //   }).then(data => {
  //     const transformedMovies = data.results.map(movieData => {
  //       return {
  //         id: movieData.episode_id,
  //         title: movieData.title,
  //         openingText: movieData.opening_crawl,
  //         releaseData: movieData.release_date
  //       }
  //     })
  //     setMovies(transformedMovies);
  //   });
  // }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }
  if (error) {
    content = <p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;

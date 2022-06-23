import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);

  // Add Loading Data 
  const [isLoading, setIsLoading] = useState(false);

  // Error Handler
  const [error, setError] = useState(null);

  //** Using async / await which is another JS built - in features
  //** Wich is more flexible and easy way then fetch() and then() - chaining method

  // Make "GET"request to send data 
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://react-http-88e46-default-rtdb.firebaseio.com/movies.json');

      if (res.status !== 200) {
        throw new Error('Something went wrong');
      }

      const data = await res.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseData: data[key].releaseData
        })
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false);
  }, []);

  //use 'useEffect' hook for an side effect behavior
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

  // Make "POST" request to store data
  async function addMovieHandler(movie) {
    const res = await fetch('https://react-http-88e46-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = res.json();
    console.log(data);
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

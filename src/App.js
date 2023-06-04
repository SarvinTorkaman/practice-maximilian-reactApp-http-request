import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];


  let [movies, setMovies] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState(null);

  
  const fetchMovieHandler= useCallback(async ()=> {
    try {
      setIsLoading(true);
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error ("Something went wrong");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movie) => {
        const item = {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
        return item;
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {fetchMovieHandler()},[fetchMovieHandler])

  let content=<p>No movie found</p>;
  if ( movies.length > 0) {
    content = <MoviesList movies={movies}  />;
  }
  if (isLoading ) {
    content = <p>Loading...</p>;
  }
  else if ( error) {
    content = error;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length>0 &&<MoviesList movies={movies}  />}
        {!isLoading && movies.length===0 && <p>No Movie Found</p>}
        { isLoading && <p>Loading...</p> }   */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;

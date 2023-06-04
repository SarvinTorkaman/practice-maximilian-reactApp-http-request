import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

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

  const fetchMovieHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://react-http-97bd2-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data);
      let loadedMovies = [];
      for (const key in data) {
        const movie = {
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        };
        loadedMovies.push(movie);
      }
      console.log(loadedMovies);

      // const transformedMovies = data.results.map((movie) => {
      //   const item = {
      //     id: movie.episode_id,
      //     title: movie.title,
      //     openingText: movie.opening_crawl,
      //     releaseDate: movie.release_date,
      //   };
      //   return item;
      // });

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const addMovieHandler = useCallback(async (movie) => {
    try {
      const repsonse = await fetch(
        "https://react-http-97bd2-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: { "Content-type": "application/json" },
        }
      );
      const data = await repsonse.json();

      console.log(data);
      // setMovies((prevMovies) => [...prevMovies, data]);
      // console.log(movies)
      fetchMovieHandler();

    } catch (error) {
      setError(error);
    }
  }, [fetchMovieHandler]);

  useEffect(()=>{addMovieHandler()}, [addMovieHandler]);

  let content = <p>No movie found</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = error;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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

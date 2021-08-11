import { useCallback, useEffect, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Header } from './components/Header';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';
import './styles/sidebar.scss';
import './styles/content.scss';

export type GenreType = 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';

export interface Genre {
  id: number;
  name: GenreType;
  title: string;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre>({} as Genre);

  const handleClickButton = useCallback((id: number) => {
    setSelectedGenreId(id);
  }, []);

  useEffect(() => {
    api.get<Genre[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<Movie[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    const updateSelectedGenre = genres.find(genre => genre.id === selectedGenreId);

    if (updateSelectedGenre) {
      setSelectedGenre(updateSelectedGenre);
    }
  }, [selectedGenreId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={handleClickButton}
      />

      <div className="container">
        <Header title={selectedGenre.title} />

        <Content movies={movies} />
      </div>
    </div>
  )
}
import styles from "./genre-stats.module.scss";

interface Genre {
  name: string;
  count: number;
  color: string;
}

interface Props {
  genres: Genre[];
}

export default function GenreProgressBar({ genres }: Props) {
  const total = genres.reduce((acc, g) => acc + g.count, 0);

  return (
    <div className={styles.progressBar}>
      {genres.map((genre) => {
        const width = (genre.count / total) * 100;
        return (
          <div
            key={genre.name}
            style={{ width: `${width}%`, backgroundColor: genre.color }}
            className={styles.segment}
          />
        );
      })}
    </div>
  );
}

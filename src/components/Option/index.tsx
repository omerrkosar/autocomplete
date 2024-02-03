import type { FC } from 'react';
import styles from './index.module.css';
type OptionProps = {
  label: string;
  image: string;
  episodeCount: number;
  checked: boolean;
  onClick: (checked: boolean) => void;
  searchTerm: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Option: FC<OptionProps> = ({
  label,
  image,
  episodeCount,
  checked,
  onClick,
  searchTerm,
  onMouseEnter,
  onMouseLeave,
}) => {
  const indexOfSearchTerm = label.toLowerCase().indexOf(searchTerm.toLowerCase());
  return (
    <div
      className={styles.option}
      onClick={() => onClick(!checked)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onClick(e.target.checked)} />
      <img className={styles.image} src={image} />
      <div>
        <p className={styles.label}>
          {label.substring(0, indexOfSearchTerm)}
          <b>{label.substring(indexOfSearchTerm, indexOfSearchTerm + searchTerm.length)}</b>
          {label.substring(indexOfSearchTerm + searchTerm.length, label.length)}
        </p>

        <p className={styles.episodeCount}>{episodeCount} Episodes</p>
      </div>
    </div>
  );
};

export default Option;

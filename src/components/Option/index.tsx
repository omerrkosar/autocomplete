import type { FC } from 'react';
import styles from './index.module.css';
import { OptionType } from 'src/types';

type OptionProps = {
  option: OptionType;
  checked: boolean;
  onClick: (checked: boolean) => void;
  searchTerm: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const getEpisodeLabel = (episodeCount: number) => {
  if (episodeCount === 1 || episodeCount === 0) {
    return 'Episode';
  } else {
    return 'Episodes';
  }
};

const Option: FC<OptionProps> = ({ option, checked, onClick, searchTerm, onMouseEnter, onMouseLeave }) => {
  const indexOfSearchTerm = option.label.toLowerCase().indexOf(searchTerm.toLowerCase());

  return (
    <div
      className={styles.option}
      onClick={() => onClick(!checked)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onClick(e.target.checked)} />
      <img className={styles.image} src={option.image} />
      <div>
        <p className={styles.label}>
          {option.label.substring(0, indexOfSearchTerm)}
          <b>{option.label.substring(indexOfSearchTerm, indexOfSearchTerm + searchTerm.length)}</b>
          {option.label.substring(indexOfSearchTerm + searchTerm.length, option.label.length)}
        </p>

        <p className={styles.episodeCount}>
          {option.episodeCount} {getEpisodeLabel(option.episodeCount)}
        </p>
      </div>
    </div>
  );
};

export default Option;

import type { FC } from 'react';
import styles from './index.module.css';
import { OptionProps } from 'src/types';

const getEpisodeLabel = (episodeCount: number) => {
  if (episodeCount === 1 || episodeCount === 0) {
    return 'Episode';
  } else {
    return 'Episodes';
  }
};

const Option: FC<OptionProps> = ({ option, label, checked, onClick, onMouseEnter, onMouseLeave }) => {
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
        {label}

        <p className={styles.episodeCount}>
          {option.episodeCount} {getEpisodeLabel(option.episodeCount)}
        </p>
      </div>
    </div>
  );
};

export default Option;

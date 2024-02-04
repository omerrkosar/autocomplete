import type { FC } from 'react';
import styles from './index.module.css';

import { ChipProps } from 'src/types';

const Chip: FC<ChipProps> = ({ chip, unselectOption }) => {
  return (
    <div className={styles.chip}>
      <p className={styles.chipsText}>{chip.label}</p>
      <button className={styles.deleteButton} onClick={() => unselectOption(chip)}>
        X
      </button>
    </div>
  );
};

export default Chip;

import type { ReactNode } from 'react';

export type OptionType = {
  label: string;
  value: string;
  image: string;
  episodeCount: number;
};

export type SearchResult = {
  id: number;
  name: string;
  image: string;
  episode: string[];
};

export type ChipProps = {
  chip: OptionType;
  unselectOption: (option: OptionType) => void;
};

export type ChipsProps = {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onFocus?: () => void;
  chips: OptionType[];
  unselectOption: (value: OptionType) => void;
  searchTerm: string;
  onChange: (searchTerm: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chipsRef: (state: HTMLDivElement) => void;
  inputRef: (state: HTMLInputElement | null) => void;
  errorMessage: string;
  renderChips?: (chips: OptionType[]) => ReactNode;
  rightIcon?: ReactNode;
  loadingIcon?: ReactNode;
};

export type OptionProps = {
  option: OptionType;
  label: string | ReactNode;
  checked: boolean;
  onClick: (checked: boolean) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type AutoCompleteProps = {
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
  getOptions: (searchTerm: string, controller: AbortController) => void;
  options: OptionType[];
  style: React.CSSProperties;
  errorMessage: string;
  selectedOptions: OptionType[];
  onSelect: (option: OptionType, checked: boolean) => void;
  renderChips?: (chips: OptionType[]) => ReactNode;
  renderOptions?: (chips: OptionType[]) => ReactNode;
  className?: string;
};

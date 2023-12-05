export interface ITimes {
  label: string;
  hint: string;
  time: Date | null;
}

export interface IFields {
  start: ITimes;
  noon: ITimes;
  afternoon: ITimes;
  end: ITimes;
}

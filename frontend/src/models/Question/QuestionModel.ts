type Theme = {
  id: number;
  name: string;
};

type Edition = {
  id: number;
  year: number;
};

type Option = {
  id: number;
  option: string;
  option_text: string;
};

export type QuestionModel = {
  id: number;
  edition: Edition;
  theme: Theme;
  stem: string;
  answer_options: Option[];
};

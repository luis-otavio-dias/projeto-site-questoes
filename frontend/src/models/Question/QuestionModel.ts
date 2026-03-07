type Option = {
  id: number;
  label: string;
  text: string;
};

type Image = {
  id: number;
  image: string;
  filename: string;
  mime_type: string;
};

export type QuestionModel = {
  id: string;
  image?: boolean; // Indicates if an image is associated
  passage_text?: string;
  sources?: string[];
  stem: string;
  options: Option[];
  area: string;
  topic: string;
  images?: Image[]; // Array of image URLs if images are associated
};

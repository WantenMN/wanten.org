type Params = Promise<{ id: string; category: Category }>;

export interface PostProps {
  params: Params;
}

export interface CategoryProps {
  params: Promise<{ category: Category }>;
}

export type Category = "thoughts" | "works" | "notes";

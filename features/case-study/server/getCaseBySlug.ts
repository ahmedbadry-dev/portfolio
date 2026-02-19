export type CaseStudy = {
  slug: string;
};

export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  void slug;
  return null;
}
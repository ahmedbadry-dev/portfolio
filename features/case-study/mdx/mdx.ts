export type CaseStudyMdxSource = {
  slug: string;
  path: string;
};

export function getCaseStudyMdxPath(slug: string): string {
  return `content/projects/${slug}.mdx`;
}
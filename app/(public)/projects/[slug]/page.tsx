type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  await params;
  return null;
}
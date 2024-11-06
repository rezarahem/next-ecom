type Params = Promise<{ slugs: string[] }>;

const TetSlug = async ({ params }: { params: Params }) => {
  const { slugs } = await params;
  const s = decodeURIComponent(slugs[1]);
  console.log(s);

  return <div></div>;
};

export default TetSlug;

type SearchParams = Promise<{
  catId: string;
}>;

const CategoryForm = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { catId } = await searchParams;

  

  return <div></div>;
};

export default CategoryForm;

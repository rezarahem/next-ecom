type HeadingProps = {
  title: string;
  description: string;
};

const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <h2 className='mb-1 text-xl font-bold tracking-tight sm:text-3xl'>
        {title}
      </h2>
      <p className='text-xs text-muted-foreground sm:text-sm'>{description}</p>
    </div>
  );
};

export default Heading;

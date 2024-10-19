import { cn } from '@/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  isFullHeight?: boolean;
  isFlex?: boolean;
  defualtPY?: boolean;
};

const Container = ({
  children,
  className,
  isFullHeight = false,
  isFlex = false,
  defualtPY: addDefualtVerticalPadding = false,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto max-w-7xl px-3',
        className,
        {
          'h-full': isFullHeight,
          'py-3': addDefualtVerticalPadding,
          flex: isFlex,
        },
      )}
    >
      {children}
    </div>
  );
};

export default Container;

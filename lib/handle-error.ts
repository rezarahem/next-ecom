import toast from 'react-hot-toast';

type Error = {
  status: number;
  response: {
    data: {
      m: string;
    };
  };
};

export const handleError = (e: Error) => {
  const { m } = e.response.data;

  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    console.log(e);
  }

  switch (e.status) {
    case 400:
      // درخواست نامعتبر
      toast.error(m);
      break;
    case 404:
      // وردی نامعتبر
      toast.error(m);
      break;
    case 503:
      toast.error(m);
      break;
    case 500:
      toast.error('خطایی سرور، دقایقی دیگر تلاش کنید');
      break;
    default:
      toast.error('خطایی رخ داد، دقایقی دیگر تلاش کنید');
      break;
  }
};

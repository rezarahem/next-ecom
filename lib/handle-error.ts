import toast from 'react-hot-toast';

type Error = {
  status: number;
  response: {
    data: {
      message: string;
    };
  };
};

export const handleError = (e: Error) => {
  const { message } = e.response.data;
  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    console.log(e);
  }

  switch (e.status) {
    case 400:
      // درخواست نامعتبر
      toast.error(message);
      break;
    case 404:
      // وردی نامعتبر
      toast.error(message);
      break;
    case 503:
      toast.error(message);
      break;
    case 500:
      toast.error('خطایی سرور، دقایقی دیگر تلاش کنید');
      break;
    default:
      toast.error('خطایی رخ داد، دقایقی دیگر تلاش کنید');
      break;
  }
};

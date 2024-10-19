'use client';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { regexOnlyDigits, toEnglishNumberStr } from '@/lib/persian-string';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { handleError } from '@/lib/handle-error';
import toast from 'react-hot-toast';
import axios from 'axios';
import { OtpSchema, PhoneNumberSchema, UserRegisterSchema } from '@/zod/zod';
import { useRouter } from 'next/navigation';

type BackendResType = {
  data: {
    message: string;
  };
  status: number;
};

type ActiveTempTypes = 'phoneNumber' | 'userName' | 'otpNumber';

const LoginForm = () => {
  const [activeTemp, setActiveTemp] = useState<ActiveTempTypes>('phoneNumber');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userOtpNumber, setUserOtpNumber] = useState('');
  const [inputError, setInputError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  ////////////////////////////////////////////////

  const setError = (e: any) => {
    setInputError(e.errors[0].message);
  };

  // const onVerification = useCallback(() => {
  //   try {
  //     startTransition(async () => {
  //       const validatedPhoneNumber = PhoneNumberSchema.safeParse(
  //         toEnglishNumberStr(phoneNumber),
  //       );

  //       if (!validatedPhoneNumber.success) {
  //         toast.error('خطایی رخ داد، مجددا تلاش کنید');
  //         setActiveTemp('phoneNumber');
  //         return;
  //       }

  //       const validatedOtp = OtpSchema.safeParse(
  //         toEnglishNumberStr(userOtpNumber),
  //       );

  //       if (!validatedOtp.success) {
  //         setInputError(validatedOtp.error.errors[0].message);
  //         return;
  //       }

  //       const res = await OtpVerification(
  //         validatedPhoneNumber.data,
  //         validatedOtp.data,
  //       );

  //       if (res.success) {
  //         toast.success('ورود موفق');
  //         router.push('/');
  //       } else {
  //         toast.error(res?.errorMessage || 'اختلال در شبکه، مجددا تلاش کنید');
  //       }
  //     });
  //   } catch (error) {
  //     toast.error('خطایی رخ داد، مجددا تلاش کنید');
  //   }
  // }, [userOtpNumber, phoneNumber, router]);

  const handleSubmit = () => {
    switch (activeTemp) {
      case 'phoneNumber':
        onSubmitPhone();
        break;
      case 'userName':
        onRegister();
        break;
      case 'otpNumber':
        onVerification();
        break;
    }
  };

  const onSubmitPhone = () => {
    startTransition(async () => {
      try {
        const verifiedFields = PhoneNumberSchema.safeParse({
          phoneNumber: toEnglishNumberStr(phoneNumber),
        });

        if (!verifiedFields.success) {
          setError(verifiedFields.error);
          return;
        }

        const { data, status } = (await axios.post(
          `${process.env.NEXT_PUBLIC_API}/auth/check-phone`,
          verifiedFields.data
        )) as BackendResType;

        switch (status) {
          case 200:
            setActiveTemp('otpNumber');
            toast.success(data.message);
            break;
          case 202:
            setActiveTemp('userName');
            toast.success(data.message);
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onRegister = () => {
    startTransition(async () => {
      try {
        const verifiedFields = UserRegisterSchema.safeParse({
          userName,
          phoneNumber: toEnglishNumberStr(phoneNumber),
        });

        if (!verifiedFields.success) {
          setError(verifiedFields.error);
          return;
        }

        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/auth/register`,
          verifiedFields.data
        );

        switch (status) {
          case 201:
            setActiveTemp('otpNumber');
            toast.success(data.message);
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onVerification = useCallback(() => {
    startTransition(async () => {
      try {
        const verifiedFields = OtpSchema.safeParse({
          otp: toEnglishNumberStr(userOtpNumber),
          phoneNumber: toEnglishNumberStr(phoneNumber),
        });

        if (!verifiedFields.success) {
          setError(verifiedFields.error);
          return;
        }

        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/auth/verify-otp`,
          verifiedFields.data
        );

        switch (status) {
          case 200:
            toast.success(data.message);
            router.push('/');
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  }, [userOtpNumber, phoneNumber, router]);

  useEffect(() => {
    if (userOtpNumber.length === 5) {
      onVerification();
    }
  }, [userOtpNumber, onVerification]);

  ////////////////////////////////////////////////
  const loginInput = () => {
    switch (activeTemp) {
      case 'phoneNumber':
        return (
          <Input
            value={phoneNumber}
            onChange={e => {
              setInputError('');
              setPhoneNumber(e.target.value);
            }}
            disabled={isPending}
            className='w-full placeholder:text-xs'
            placeholder='شماره تماس'
          />
        );

      case 'userName':
        return (
          <Input
            value={userName}
            onChange={e => {
              setInputError('');
              setUserName(e.target.value);
            }}
            disabled={isPending}
            className='ss02 w-full placeholder:text-xs'
            placeholder='نام و نام‌خانوادگی'
          />
        );

      case 'otpNumber':
        return (
          <div>
            <InputOTP
              containerClassName='justify-between'
              pattern={regexOnlyDigits}
              maxLength={5}
              value={userOtpNumber}
              onChange={v => {
                setUserOtpNumber(v);
              }}
              disabled={isPending}>
              <InputOTPGroup>
                <InputOTPSlot index={4} />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot index={0} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        );
    }
  };
  const formLabel = () => {
    switch (activeTemp) {
      case 'phoneNumber':
        return 'برای ادامه وارد شوید';

      case 'otpNumber':
        return 'کد تایید را ثبت کنید';

      case 'userName':
        return 'ثبت نام';
    }
  };
  const buttonLabel = () => {
    switch (activeTemp) {
      case 'phoneNumber':
        return 'ورود';

      case 'otpNumber':
        return 'ثبت';

      case 'userName':
        return 'ثبت';
    }
  };

  return (
    <div className='w-full space-y-4 p-5'>
      <div className='relative mx-auto max-w-96 '>
        <p className='mb-10 text-sm text-muted-foreground'>{formLabel()}</p>
        <span className='absolute right-[3px] top-10 text-xs text-red-500'>
          {inputError}
        </span>
        {loginInput()}
        <Button
          onClick={handleSubmit}
          size='lg'
          className='mr-auto mt-10 flex'
          disabled={isPending}>
          {buttonLabel()}
          <div className='-translate-x-3'>
            {false ?
              <LoaderCircle className='size-4 animate-spin' />
            : <ArrowLeft className='size-4' />}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;

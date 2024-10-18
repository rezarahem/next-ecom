import 'server-only';
import axios from 'axios';

export const sendOtp = async (phone: string, otp: string): Promise<boolean> => {
  try {
    const res = await axios.post(
      `https://console.melipayamak.com/api/send/shared/${process.env.SMS_PROVIDER_KEY}`,
      {
        bodyId: +process.env.SMS_TEMPLATE_ID!,
        to: phone,
        args: [` ${otp}`],
      }
    );

    const { recId } = res.data;

    if (!recId) return false;

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

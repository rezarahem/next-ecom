import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});

export const s3Upload = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const fileKey = `${Date.now()}_${file.name}`;
  const params = {
    Body: Buffer.from(bytes),
    Bucket: process.env.LIARA_BUCKET_NAME as string,
    Key: fileKey,
    ContentType: file.type,
  };

  const res = await s3.send(new PutObjectCommand(params));

  if (res.$metadata.httpStatusCode !== 200) return null;

  return `${process.env.LIARA_BUCKET_ADDRESS}/${fileKey}`;
};

export const s3MultiUpload = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const bytes = await file.arrayBuffer();
    const fileKey = `${Date.now()}_${file.name}`;
    const params = {
      Body: Buffer.from(bytes),
      Bucket: process.env.LIARA_BUCKET_NAME as string,
      Key: fileKey,
      ContentType: file.type,
    };

    const res = await s3.send(new PutObjectCommand(params));

    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error(`Failed to upload ${file.name}`);
    }

    return `${process.env.LIARA_BUCKET_ADDRESS}/${fileKey}`;
  });

  try {
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    return error;
  }
};

export const s3Delete = async (url: string) => {
  const segments = url.split('/');

  const fileKey = segments[segments.length - 1];

  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME as string,
    Key: fileKey,
  };

  const res = await s3.send(new DeleteObjectCommand(params));

  if (res.$metadata.httpStatusCode !== 204) return null;

  return url;
};

export const s3MultiDelete = async (urls: string[]) => {
  const deletePromises = urls.map(async (url) => {
    const segments = url.split('/');
    const fileKey = segments[segments.length - 1];
    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME as string,
      Key: fileKey,
    };
    const res = await s3.send(new DeleteObjectCommand(params));
    if (res.$metadata.httpStatusCode !== 204) return null;
    return url;
  });
  try {
    const deleteResults = await Promise.all(deletePromises);
    return deleteResults;
  } catch (error) {
    return error;
  }
};

// export const s3MultiDelete = async (urls: string[]) => {
//   const objectsToDelete = urls.map((url) => {
//     const segments = url.split('/');
//     const fileKey = segments[segments.length - 1];
//     return { Key: fileKey };
//   });

//   const params = {
//     Bucket: process.env.LIARA_BUCKET_NAME as string,
//     Delete: {
//       Objects: objectsToDelete,
//       Quiet: true,
//     },
//   };

//   const res = await s3.send(new DeleteObjectsCommand(params));

//   console.log(res);

//   if (res.$metadata.httpStatusCode !== 204) return null;

//   return urls;
// };

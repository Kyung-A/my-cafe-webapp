import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

export async function formDataPromise(request: Request): Promise<FormData> {
  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          file: ({ filename }) => filename,
        }),
        unstable_createMemoryUploadHandler()
      )
    );

    return new Promise((resolve) => resolve(formData));
  } catch (err) {
    console.error(err);
    throw Error();
  }
}

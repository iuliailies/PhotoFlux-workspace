/// <reference lib="webworker" />

interface ImageRequest {
  type: 'fetchImages';
  data: any;
}

addEventListener('message', async ({ data }: { data: ImageRequest }) => {
  if (data.type === 'fetchImages') {
    const { urls } = data.data;
    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          return { url, blob };
        } catch (error) {
          return { url, error: 'Failed to fetch' };
        }
      })
    );
    postMessage({ type: 'fetchImages', results });
  }
});

export const ipfsToHttp = (ipfsUrl: string): string => {
  const tempUrl: string = ipfsUrl.slice(7, ipfsUrl.length);
  const finalUrl: string = 'https://nftstorage.link/ipfs/' + tempUrl;
  return finalUrl;
};

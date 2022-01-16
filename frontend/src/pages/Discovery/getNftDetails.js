import axios from 'axios';

const API_KEY = '83e8edc7-e058-4bce-8c0f-b18e6d4dfb88';
const BASE_URL = 'https://api.nftport.xyz/v0';

export default async function getNftDetails({ contractAddress, tokenId }) {
  console.log('contractAddress', contractAddress);
  console.log('tokenId', tokenId);
  try {
    const { data: result } = await axios.get(
      `${BASE_URL}/transactions/nfts/${contractAddress}/${tokenId}`,
      {
        headers: {
          Authorization: API_KEY,
        },
        params: {
          chain: 'ethereum',
          type: 'list',
        },
      }
    );
    console.log('result: ', result);
  } catch (err) {
    console.log('err: ', err);
  }
}

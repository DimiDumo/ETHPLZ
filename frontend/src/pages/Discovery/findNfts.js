import axios from 'axios';

const API_KEY = '83e8edc7-e058-4bce-8c0f-b18e6d4dfb88';
const BASE_URL = 'https://api.nftport.xyz/v0';

export default async function findNfts(searchText) {
  console.log('finding NFTs with NFT port');
  try {
    const { data: result } = await axios.get(`${BASE_URL}/search`, {
      headers: {
        Authorization: API_KEY,
      },
      params: {
        text: searchText,
      },
    });
    console.log('NFT Port result: ', result);
    if (result.response !== 'OK') {
      throw new Error('response from NFT Port was not OK');
    }
    return result.search_results.map((item) => ({
      id: `${item.token_id}-${item.contract_address}`,
      tokenId: item.token_id,
      imgSrc: item.cached_file_url,
      title: item.name,
      description: item.description,
      contractAddress: item.contract_address,
    }));
  } catch (err) {
    console.warn('Could not get search results from NFT Port: ', err);
  }
  return [];
}

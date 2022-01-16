import React from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { useParams, useHistory } from 'react-router-dom';

import classnames from 'classnames';
import BasePage from '../BasePage/BasePage';
import DetailView from './DetailView';
import exampleContent from './content.json';
import findNfts from './findNfts';

const Discovery = () => {
  const history = useHistory();
  const { nftId } = useParams();

  const [isDetailedViewOpen, setIsDetailedViewOpen] = React.useState(false);
  const [activeNFT, setActiveNFT] = React.useState({});
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [content, setContent] = React.useState(exampleContent);

  const handleClick = (nft) => {
    setIsDetailedViewOpen(true);
    setActiveNFT(nft);
    history.push(`/${nft.id}`);
  };

  const fetchNewNfts = async () => {
    const newNfts = await findNfts(searchText);
    setContent([]);
    setContent(newNfts);
  };

  const options = (
    <>
      <div className="grid grid-cols-3 bottom-0 pt-5">
        <div className="col-span-1" />
        <div className="col-span-1">
          <img src="/filter.png" alt="" />
        </div>
        <div className="col-span-1">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowSearchBar(!showSearchBar)}
          >
            <img src="/search.png" alt="" />
          </button>
        </div>
      </div>
    </>
  );

  React.useEffect(() => {
    if (nftId) {
      setIsDetailedViewOpen(true);
      const nft = content.find((item) => item.id === nftId);
      setActiveNFT(nft);
    }
  }, [nftId]);

  return (
    <BasePage headerTitle="Discover" rightElem={options} pageName="discover">
      <div className="grid grid-cols-3 gap-1 pt-1 bg-base-100">
        <div
          className={classnames('col-span-3', {
            'page-inactive': !showSearchBar,
          })}
        >
          <form action="#" onSubmit={e => {e.preventDefault();fetchNewNfts();}}>
            <input
              type="text"
              placeholder="search..."
              className=""
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>
        </div>
        {content.map((item) => (
          <div
            key={item.id}
            role="button"
            onClick={() => handleClick(item)}
            className="img-preview"
          >
            <img src={item.imgSrc} alt="" />
          </div>
        ))}
      </div>
      <DetailView
        isModalOpen={isDetailedViewOpen}
        setIsModalOpen={setIsDetailedViewOpen}
        nft={activeNFT}
        nftId={nftId}
      />
    </BasePage>
  );
};

export default Discovery;

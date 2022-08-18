import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { create as ipfsHttpClient } from 'ipfs-http-client';
import { uploadMetaData } from '../helper/upload';
import { signInRequestMetaMask } from '../helper/metamask.ts';
import { _listingToMarket, _minting } from '../helper/collection.ts';
import PropertiesModal from '../components/propertiesModal';
import MakeCollectionModal from '../components/MakeCollectionModal';
import Dropdown from '../components/Dropdown';
import Web3 from 'web3';
import Market from '../../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json';
import { Market_ADDRESS } from '../../config';
import { data } from 'autoprefixer';

const ipfsBaseUrl = process.env.NEXT_PUBLIC_IPFS_BASE_URL;
// const client = ipfsHttpClient(`${ipfsBaseUrl}`);

const CreateNFTToken = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [isDisable, setIsDisable] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInput, setFormInput] = useState({
    name: '',
    description: '',
  });
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState({});
  const [collectionList, setCollectionList] = useState([]);
  const [file, setFile] = useState(undefined);

  const router = useRouter();

  const onChange = async (event) => {
    const _file = event.target.files[0];
    const url = URL.createObjectURL(_file);
    setFile(_file);
    setFileUrl((preState) => (preState = url));
  };

  const creatingNftMetaData = async () => {
    //show a loading circle or smth
    const { name, description } = formInput;
    console.log(formInput);
    if (!name || !description || !fileUrl) return;
    const data = {
      name,
      description,
      attributes: attributes,
    };

    const metaDataUrl = await uploadMetaData(data, file);
    console.log(metaDataUrl);
    console.log(selectedCollection.returnValues.collectionAddress);
    const tokenId = await _minting(
      metaDataUrl,
      selectedCollection.returnValues.collectionAddress
    );
    console.log(tokenId);
    router.push('/nft');
  };

  const getEvents = async () => {
    const web3 = new Web3(window.ethereum);
    const marketContract = new web3.eth.Contract(Market.abi, Market_ADDRESS);
    const option = {
      filter: {
        owner: await web3.eth.getAccounts(),
      },
      fromBlock: 0,
      toBlock: 'latest',
    };

    const defaultCollEvent = await marketContract.getPastEvents(
      'CollectionCreated',
      {
        fromBlock: 0,
        toBlock: 'latest',
      }
    );
    console.log(defaultCollEvent);

    setCollectionList([defaultCollEvent[0]]);
    const events = await marketContract.getPastEvents(
      'CollectionCreated',
      option
    );
    setCollectionList((data) => [...data, ...events]);
    // setCollectionList(events);
    setSelectedCollection(collectionList[0]);
    console.log(collectionList);
  };

  const handleChange = (e) => {
    setSelectedCollection(collectionList[e.target.value]);
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    getEvents();
    if (formInput.name && formInput.description && fileUrl) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [formInput, fileUrl]);

  const attributeModalHandler = async () => {
    await signInRequestMetaMask();
    // setIsModalOpen(true);
  };

  return (
    <div className="w-full h-screen">
      <div className="flex mx-auto justify-center relative">
        {isModalOpen && (
          <div className="absolute w-full h-full min-w-full min-h-screen bg-black bg-opacity-60 z-40">
            <PropertiesModal
              attributes={attributes}
              setAttributes={setAttributes}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        )}
        {isCollectionModalOpen && (
          <MakeCollectionModal
            getEvents={getEvents}
            isCollectionModalOpen={isCollectionModalOpen}
            setIsCollectionModalOpen={setIsCollectionModalOpen}
          />
        )}
        <div className="flex flex-col space-y-5 w-2/5 my-5">
          <h2 className="flex font-semibold text-4xl mb-2 ">Create New Item</h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-gray-700">
              Image, Video, Audio, or 3D Model
            </h3>
            <div className="relative h-[25vh] w-[25vh] rounded-full bg-slate-200 border-dotted border-2 border-gray-500">
              {fileUrl && (
                <Image
                  src={fileUrl}
                  width={500}
                  height={500}
                  objectFit="cover"
                  alt="image"
                  className="rounded-full"
                />
              )}

              <input
                type="file"
                name="nft-file"
                onChange={onChange}
                className="absolute opacity-0 rounded-full w-40 h-40"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="bg-blue-400 py-4 px-8 rounded-xl text-white font-bold text-xl disabled:bg-blue-200"
              onClick={() => {
                setIsCollectionModalOpen(true);
              }}
            >
              Create Collection
            </button>
          </div>
          {collectionList.length !== 0 ? (
            <div className="space-y-2">
              <Dropdown
                onChange={handleChange}
                collectionList={collectionList}
              />
            </div>
          ) : (
            ''
          )}
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-gray-700">Name</h3>
            <input
              type="text"
              required
              className="ring-1 ring-gray-300  bg-none  px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
              placeholder="NFT Name"
              onChange={(event) =>
                setFormInput((preState) => ({
                  ...preState,
                  name: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-gray-700">Description</h3>
            <textarea
              type="text"
              required
              className="ring-1 ring-gray-300  bg-none  px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
              placeholder="NFT Description"
              onChange={(event) =>
                setFormInput((preState) => ({
                  ...preState,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="h-[9vh] rounded flex items-center pr-5 py-2 justify-between">
            <div>
              <h3 className="font-semibold text-xl text-gray-700 ">
                Properties
              </h3>
              <p>Textual traits that show up as rectangles</p>
            </div>
            <button
              onClick={attributeModalHandler}
              className="w-10 border border-gray-300 h-full rounded text-2xl font-semibold flex justify-center items-center"
            >
              +
            </button>
          </div>
          <hr className="border-t-px border-solid border-gray-300" />

          <div className="pb-10">
            <button
              className="bg-blue-400 py-4 px-8 rounded-xl text-white font-bold text-xl disabled:bg-blue-200"
              onClick={creatingNftMetaData}
              disabled={isDisable}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFTToken;

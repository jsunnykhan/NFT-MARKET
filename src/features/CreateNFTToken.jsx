import React, { useEffect, useState, CSSProperties } from 'react';
import PropertiesModal from '../components/propertiesModal';
import MakeCollectionModal from '../components/MakeCollectionModal';
import Dropdown from '../components/Dropdown.tsx';
import Image from 'next/image';
import CustomModal from '../components/CustomModal';
import { useRouter } from 'next/router';
import { uploadMetaData } from '../helper/upload';
import { _listingToMarket, _minting } from '../helper/collection.ts';
import {
  _getAllOwnedCollection,
  _getDefaultCollection,
} from '../helper/collection.ts';
import { useConnect } from '../helper/hooks/useConnect';

const ipfsBaseUrl = process.env.NEXT_PUBLIC_IPFS_BASE_URL;

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
  const [collections, setCollections] = useState([]);
  const [file, setFile] = useState(undefined);
  const [collectionAddress, setCollectionAddress] = useState('');

  const router = useRouter();

  const onChange = async (event) => {
    const _file = event.target.files[0];
    const url = URL.createObjectURL(_file);
    setFile(_file);
    setFileUrl((preState) => (preState = url));
  };

  const [account, chainId, connect, isMetamask] = useConnect();

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    if (account) {
      getAllOwnedCollection();
    } else {
      getDefaultCollection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const getAllOwnedCollection = async () => {
    const collectionList = await _getAllOwnedCollection(account);
    setSelectedCollection(collectionList[0]);
    setCollections((pre) => (pre = collectionList));
  };

  const getDefaultCollection = async () => {
    const defaultCollection = await _getDefaultCollection();
    setSelectedCollection(defaultCollection);
    setCollections((pre) => (pre = [defaultCollection]));
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
    console.log(selectedCollection.address);
    const tokenId = await _minting(metaDataUrl, selectedCollection.address);
    console.log(tokenId);
    router.push('/collectors');
  };

  useEffect(() => {
    if (formInput.name && formInput.description && fileUrl) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [formInput, fileUrl]);

  const attributeModalHandler = async () => {
    // await signInRequestMetaMask();
    setIsModalOpen(true);
  };

  const createCollection = () => {
    setIsCollectionModalOpen((pre) => (pre = true));
  };

  return (
    <div className="w-full">
      <div className="flex mx-auto justify-center relative">
        {isModalOpen && (
          <CustomModal>
            <PropertiesModal
              attributes={attributes}
              setAttributes={setAttributes}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </CustomModal>
        )}
        {isCollectionModalOpen && (
          <MakeCollectionModal
            isCollectionModalOpen={isCollectionModalOpen}
            setIsCollectionModalOpen={setIsCollectionModalOpen}
            getAllOwnedCollection={getAllOwnedCollection}
          />
        )}

        <div className="flex flex-col space-y-5 w-2/5 my-5">
          <h2 className="flex font-medium text-4xl mb-2 font-serif">
            Create New NFT
          </h2>
          <div className="space-y-2">
            <h3 className="font-medium text-base text-gray-700">
              Image, Video, Audio, or 3D Model
            </h3>
            <div className="relative h-[20vw] w-1/2 rounded bg-slate-200 border-dotted border-2 border-gray-500">
              {fileUrl && (
                <Image
                  src={fileUrl}
                  width={500}
                  height={500}
                  objectFit="cover"
                  alt="image"
                  className="rounded"
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
          {collections.length !== 0 ? (
            <div className="space-y-2">
              <Dropdown
                setCollectionAddress={setCollectionAddress}
                collections={collections}
                createCollection={createCollection}
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-gray-700">Name</h3>
            <input
              type="text"
              required
              className="ring-1 ring-gray-300  bg-primary  px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
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
            <h3 className="text-base font-medium text-gray-700">Description</h3>
            <textarea
              type="text"
              required
              className="ring-1 ring-gray-300 bg-primary px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
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
              <p className="font-medium text-base ">
                Textual traits that show up as rectangles
              </p>
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

import React from 'react';
import CustomModal from './CustomModal';
import ReactLoading from 'react-loading';
import Steps from 'rsuite/Steps';
import 'rsuite/dist/rsuite.min.css';
import Loading from './LoadingBubble';

const LoadingModal = (props) => {
  const { metaDataState } = props;
  return (
    <CustomModal>
      <div className="text-primary absolute top-0 left-0 right-0 bottom-0 z-30 w-full h-full bg-black bg-opacity-60 min-w-full min-h-screen">
        <div className="relative flex flex-col justify-center w-max h-max mt-40 m-auto items-center bg-white ring-1 ring-purple-100 rounded p-20">
          {/* <Steps vertical className="text-primary w-full" current={0}>
            <div className="flex items-start">
              <Steps.Item title="Creating Metadata" />
              <Loading />
            </div>
            <div className="flex items-start">
              <Steps.Item title="Varifying Signature" />
              <Loading />
            </div>
            <div className="flex items-start">
              <Steps.Item title="Minting NFT" />
              <Loading />
            </div>
          </Steps> */}
          <Steps
            vertical
            className="text-primary w-full"
            current={metaDataState}
          >
            <Steps.Item title="Creating Metadata" />
            <Steps.Item title="Varifying Signature" />
            <Steps.Item title="Minting NFT" />
          </Steps>
          {metaDataState === 0 ? (
            <h1 className="font-medium text-lg">Creating Metadata...</h1>
          ) : metaDataState === 1 ? (
            <h1 className="font-medium text-lg">Varifying Signature...</h1>
          ) : metaDataState === 2 ? (
            <h1 className="font-medium text-lg">Minting Nft...</h1>
          ) : (
            ''
          )}
          <ReactLoading type="bubbles" color="#000" />
        </div>
      </div>
    </CustomModal>
  );
};

export default LoadingModal;

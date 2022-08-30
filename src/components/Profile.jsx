import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { _getProfile, _uploadProfile } from '../helper/profile';
import { _getOwnerOfCollection } from '../helper/collection.ts';
import { _getSignerProvider } from '../helper/contracts.ts';

import { MdModeEditOutline } from 'react-icons/md';
import { useConnect } from '../helper/hooks/useConnect.ts';

const Profile = (props) => {
  const { address, isCollection } = props;
  const [account, chainId, connect, isMetamask, isActive] = useConnect();
  const [profileURL, setProfileURL] = useState('');
  const [coverURL, setCoverURL] = useState('');
  const [reload, setReload] = useState(false);
  const [coverHover, setCoverHover] = useState(false);
  const [hover, setHover] = useState(false);
  const [isCollectionOwner, setIsCollectionOwner] = useState(false);

  const onChange = async (event, type) => {
    const _file = event.target.files[0];
    let formData = new FormData();
    const url = URL.createObjectURL(_file);
    formData.append('file', _file);

    if (type === 'cover') {
      setCoverURL((pre) => (pre = url));
    } else if (type === 'profile') {
      setProfileURL((pre) => (pre = url));
    }
    const data = await _uploadProfile(formData, address, type);
    if (data) {
      setReload((pre) => (pre = !pre));
    }
  };

  const isOwner = async (_account) => {
    const _owner = await _getOwnerOfCollection(address);
    console.log(_owner.toLowerCase() === _account.toLowerCase());
    setIsCollectionOwner(_owner.toLowerCase() === _account.toLowerCase());
  };

  useEffect(() => {
    if (address && account) {
      if (isCollection) {
        getProfile();
        isOwner(account);
      } else {
        getProfile();
      }
    }
  }, [address, account]);

  const getProfile = async () => {
    const data = await _getProfile(address, 'cover');
    setCoverURL((pre) => (pre = data));
    const d = await _getProfile(address, 'profile');
    setProfileURL((pre) => (pre = d));
  };

  return (
    <div className="mb-16">
      <div className="relative h-[40vh] bg-white-200 rounded-lg">
        <div
          className="w-full h-full overflow-hidden"
          onMouseOver={() => setCoverHover(true)}
          onMouseOut={() => setCoverHover(false)}
        >
          {isCollectionOwner ? (
            <div className="absolute  bottom-5 right-5 z-30 rounded-full bg-primary bg-opacity-40 shadow-md">
              <div className="relative w-full h-full cursor-pointer overflow-hidden">
                <MdModeEditOutline className="m-2" size={24} />
                <input
                  type="file"
                  name="profile-cover"
                  onChange={(event) => onChange(event, 'cover')}
                  className="absolute top-0 cursor-pointer opacity-0 rounded-full h-full w-full"
                />
              </div>
            </div>
          ) : (
            ''
          )}

          <div className="relative rounded-md object-center overflow-hidden">
            {coverURL && (
              <Image
                src={coverURL}
                width={1280}
                height={720}
                objectFit="cover"
                objectPosition="center"
                alt="image"
                className="rounded-md object-center"
              />
            )}
          </div>
        </div>

        <div className="absolute -bottom-16 left-8 w-[10vw] h-[10vw] bg-white rounded-md">
          <div
            className="relative h-full w-full"
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          >
            {isCollectionOwner ? (
              <div className="absolute bottom-12 right-12 ">
                <div className="absolute z-30 rounded-full bg-primary bg-opacity-40 p-2 cursor-pointer shadow-md">
                  <MdModeEditOutline className="" size={20} />
                  <input
                    type="file"
                    name="profile-profile"
                    onChange={(event) => onChange(event, 'profile')}
                    className="absolute top-0 cursor-pointer opacity-0 rounded-full h-full w-full"
                  />
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="relative rounded object-center overflow-hidden w-full h-full">
              {profileURL && (
                <Image
                  src={profileURL}
                  width={1280}
                  height={1280}
                  objectFit="cover"
                  objectPosition="center"
                  alt="image"
                  className="rounded object-center"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

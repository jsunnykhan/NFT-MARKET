import React, { useState } from "react";
import Image from "next/image";

const Profile = (props) => {
  const { address } = props;
  const [profilePic, setProfilePic] = useState("");
  const [cover, setCover] = useState("");

  return (
    <div className="mb-16">
      <div className="relative h-[40vh] bg-white-200 rounded-lg">
        {cover ? <Image src={""} layout="fill" alt="profile" /> : null}
        <div className="absolute -bottom-10 left-8 w-32 h-32 bg-white rounded-md">
          <div className="relative overflow-hidden">
            {profilePic ? <Image src={""} layout="fill" alt="profile" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import Image from "next/image";
import React, { Children } from "react";

import SVGLogo from "../../public/ethereum.svg";

interface PropsType {
  url?: string;
  children?: any;
  fill?: string;
  className?: string;
  size?: number | string;
}

const CustomSvg = (props: PropsType) => {
  const { url, children, fill, className, size = 24 } = props;
  return (
    <div className="p-0 m-0 w-max h-max">
      {/* <SVGLogo /> */}
      {url ? (
        <Image
          src={url}
          width={size}
          height={size}
          alt=""
          className={className}
        />
      ) : (
        children
      )}
    </div>
  );
};

export default CustomSvg;

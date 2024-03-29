import React from 'react';

const Loading = () => {
  return (
    <div className="w-10 h-12">
      <svg
        style={{ margin: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <circle transform="translate(8 0)" cx="0" cy="14" r="0">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0"
            keytimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="translate(16 0)" cx="0" cy="14" r="0">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.3"
            keytimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="translate(24 0)" cx="0" cy="14" r="0">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.6"
            keytimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
      </svg>
    </div>
  );
};

export default Loading;

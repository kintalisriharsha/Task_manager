import React from 'react';
import './Loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  fullScreen = false,
  message
}) => {
  const loaderContent = (
    <>
      <div className={`loader-spinner ${size}`}></div>
      {message && <p className="loader-message">{message}</p>}
    </>
  );

  if (fullScreen) {
    return (
      <div className="loader-full-screen">
        {loaderContent}
      </div>
    );
  }

  return <div className="loader">{loaderContent}</div>;
};

export default Loader;
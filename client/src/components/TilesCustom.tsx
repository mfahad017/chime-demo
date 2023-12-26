import {
  useRemoteVideoTileState,
  useRosterState,
} from 'amazon-chime-sdk-component-library-react';
import React from 'react';

export const TilesCustom = () => {
  const rs = useRosterState();
  const rvts = useRemoteVideoTileState();
  console.groupCollapsed('TilesCustom');

  console.log(rs);
  console.log(rvts);

  console.groupEnd();

  const name = 'me',
    className = '',
    noRemoteVideoViewEnabled = false;

  return (
    <div>
      {' '}
      <div
        className={`${
          noRemoteVideoViewEnabled
            ? 'local-video-tile-container'
            : 'tile-container'
        } ${className}`}
      >
        <div
          className={
            noRemoteVideoViewEnabled
              ? 'local-video-tile-inner-container'
              : 'tile-inner-container'
          }
        >
          <p
            className={
              noRemoteVideoViewEnabled ? 'local-video-tile-text' : 'tile-text'
            }
          >
            {name
              ?.split(' ')
              .map((item: string) => item[0])
              .slice(0, 2)
              .join('')}
          </p>
        </div>
      </div>
    </div>
  );
};

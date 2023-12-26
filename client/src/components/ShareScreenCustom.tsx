import {
  useContentShareControls,
  useContentShareState,
} from "amazon-chime-sdk-component-library-react";

const ShareScreenCustom = () => {
  const {
    // paused,
    // tileId,
    // isLocalShareLoading,
    // sharingAttendeeId,
    isLocalUserSharing,
  } = useContentShareState();

  const {
    toggleContentShare,
    //   togglePauseContentShare
  } = useContentShareControls();

  return (
    <div className="rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
      <button
        className="bg-emerald-500 p-2 rounded text-white"
        onClick={() => toggleContentShare()}
      >
        {isLocalUserSharing ? "Stop Sharing" : "Start Sharing"}
      </button>
    </div>
  );
};

export default ShareScreenCustom;

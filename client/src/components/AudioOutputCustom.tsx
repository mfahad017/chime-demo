import { Menu } from '@headlessui/react';
import {
  useAudioOutputs,
  useAudioVideo,
  useLocalAudioOutput,
} from 'amazon-chime-sdk-component-library-react';

export const AudioOutputCustom = () => {
  const ao = useAudioOutputs();

  const lao = useLocalAudioOutput();
  const av = useAudioVideo();

  function handleAudioOutputToggle() {
    lao.toggleAudio();
  }

  function handleSelectAudioInputDevice(p: string) {
    if (!av) return;

    av.chooseAudioOutput(p);
  }

  return (
    <div className="rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
      <h1>Audio Ouput</h1>
      <div className="flex flex-row gap-4">
        <button
          className={`bg-emerald-500 p-2 rounded text-white ${
            !lao.isAudioOn && 'line-through'
          }`}
          onClick={handleAudioOutputToggle}
        >
          Toggle
        </button>
        <Menu as={'div'} className="relative ">
          <Menu.Button className="bg-emerald-500 p-2 rounded text-white">
            Device
          </Menu.Button>
          <Menu.Items className="absolute z-10 top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded overflow-clip">
            {ao.devices.map((device) => {
              return (
                <Menu.Item
                  onClick={() => handleSelectAudioInputDevice(device.deviceId)}
                  as={'button'}
                  className="py-2 px-4 hover:bg-blue-500 hover:text-white transition-all"
                >
                  {device.label}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

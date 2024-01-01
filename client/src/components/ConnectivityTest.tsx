import { useEffect, useState } from "react";
import useMeeting from "../hooks/useMeeting";

const ConnectivityCheck = ({ onCheckComplete }) => {
  const { performConnectivityTest } = useMeeting();

  const [testResults, setTestResults] = useState({
    audio: "pending",
    video: "pending",
    contentShare: "pending",
  });

  useEffect(() => {
    async function runTests() {
      const results = await performConnectivityTest();
      setTestResults(results);
      onCheckComplete(results);
    }
    runTests();
  }, [performConnectivityTest, onCheckComplete]);

  return (
    <div>
      <h2>Connectivity Check</h2>
      <p>Audio: {testResults.audio}</p>
      <p>Video: {testResults.video}</p>
      <p>Content Share: {testResults.contentShare}</p>
    </div>
  );
};

export default ConnectivityCheck;

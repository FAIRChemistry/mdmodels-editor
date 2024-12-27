import React, { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { setTourTaken } from "@/lib/tour-config";

interface TourProps {
  steps: Step[];
}

const Tour: React.FC<TourProps> = ({ steps }: TourProps) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    setRunTour(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    // When tour is finished or skipped, set the cookie
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setTourTaken();
      // setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: "#238636",
          backgroundColor: "#0d1117",
          textColor: "#c9d1d9",
          arrowColor: "#161b22",
          overlayColor: "rgba(13, 17, 23, 0.3)",
          spotlightShadow: "0 0 15px rgba(35, 134, 54, 0.5)",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default Tour;

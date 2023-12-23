import React, { FC } from "react";

import { AvailableSchedulesDetails } from "../../components/Schedules/AvailableSchedules/AvailableSchedulesDetails/AvailableSchedulesDetails";
import { useAppSelector } from "../../hooks";

const AvailableSchedulesDetailsPage: FC = () => {
  const { selectedMaster } = useAppSelector((state) => state.schedules);
  return (
    <div>
      <AvailableSchedulesDetails availableSchedule={selectedMaster} />
    </div>
  );
};

export { AvailableSchedulesDetailsPage };

import React, { FC, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../hooks";
import styles from "../../../pages/AvailableSchedulesPage/AvailableSchedulesPage.module.scss";
import { schedulesActions } from "../../../redux";
import { AvailableSchedulesMaster } from "./AvailableSchedulesMaster/AvailableSchedulesMaster";

const AvailableSchedules: FC = () => {
  const { availableSchedules } = useAppSelector((state) => state.schedules);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(schedulesActions.getAvailableSchedules());
  }, [dispatch]);

  if (!availableSchedules || availableSchedules.length === 0) {
    return <div>No available schedules</div>;
  }
  return (
    <div className={styles.available__container}>
      {availableSchedules.map((availableSchedule) => (
        <AvailableSchedulesMaster
          key={availableSchedule.master_id}
          availableSchedule={availableSchedule}
        />
      ))}
    </div>
  );
};

export { AvailableSchedules };
import { joiResolver } from "@hookform/resolvers/joi";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import InfoIcon from "@mui/icons-material/Info";
import React, { FC, PropsWithChildren, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector, useToggle } from "../../../../hooks";
import { IUpdateSchedulesParams } from "../../../../interfaces";
import { ISchedule } from "../../../../interfaces/scheduleInterface";
import { schedulesActions } from "../../../../redux";
import { schedulesShema } from "../../../../validators";
import styles from "../AllSchedules.module.scss";

interface IProps extends PropsWithChildren {
  schedule: ISchedule;
}

const SchedulesMasterInfo: FC<IProps> = ({ schedule }) => {
  const { schedule_id, status, date_time } = schedule;
  const { user } = useAppSelector((state) => state.auth);
  const { updatedSchedule } = useAppSelector((state) => state.schedules);
  const userId = user.data.id;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { value: isEditing, change: toggleEdit } = useToggle(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUpdateSchedulesParams>({
    resolver: joiResolver(schedulesShema),
  });

  useEffect(() => {
    if (schedule) {
      setValue("date_time", date_time);
    }
    if (updatedSchedule && updatedSchedule.schedule_id === schedule_id) {
      setValue("date_time", updatedSchedule.date_time);
    }
  }, [schedule_id, updatedSchedule, setValue]);

  const deleteSchedule = async () => {
    await dispatch(
      schedulesActions.deleteScheduleById({
        userId,
        scheduleId: schedule_id,
      }),
    );
    dispatch(schedulesActions.getAllUsersSchedules({ userId }));
  };

  const getDetails = () => {
    navigate(`${schedule_id}`, { state: schedule });
  };

  // delete client's appointment from master account

  // const deleteAppo = async () => {
  //   await dispatch(
  //     appointmentsActions.deleteAppointmentById({
  //       userId,
  //       appointmentId: appointment.id,
  //     }),
  //   );
  //   dispatch(appointmentsActions.getUserAllAppointments({ userId }));
  // };

  const onSubmit: SubmitHandler<IUpdateSchedulesParams> = async (params) => {
    await dispatch(
      schedulesActions.updateScheduleById({
        userId: userId,
        scheduleId: schedule_id,
        params,
      }),
    );
    dispatch(schedulesActions.setUpdatedParams({ ...params, schedule_id }));
    toggleEdit();
    dispatch(schedulesActions.getAllUsersSchedules({ userId: userId }));
  };

  const time = date_time.substring(11, 16);

  return (
    <div className={styles.schedules__table__item}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className={styles.schedules__status}>
          <AssignmentTurnedInOutlinedIcon />
          <h4>{status}</h4>
        </div>
        {isEditing ? (
          <form
            className={styles.schedules__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div style={{ marginBottom: "15px" }}>
              <label className={styles.schedules__form__label}>
                <EventOutlinedIcon />
                <input
                  type="text"
                  {...register("date_time")}
                  defaultValue={time}
                />
              </label>
              {errors.date_time && (
                <div className={styles.schedules__form__error}>
                  {errors?.date_time && <span>invalid time</span>}
                </div>
              )}
            </div>
            <div className={styles.schedules__buttonAction}>
              <button type="submit">Update Schedule</button>
              <button type="button" onClick={toggleEdit}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.schedules__table__info}>
            <div className={styles.schedules__table__time}>
              <AccessTimeIcon />
              <p>{time}</p>
            </div>
            <div className={styles.schedules__buttonAction}>
              <button onClick={toggleEdit}>
                <EditIcon />
              </button>
              <button onClick={deleteSchedule}>
                <DeleteForeverIcon />
              </button>
              <button onClick={getDetails}>
                <InfoIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SchedulesMasterInfo };
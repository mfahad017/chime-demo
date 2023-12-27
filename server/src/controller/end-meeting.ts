import { DeleteAttendeeCommand } from "@aws-sdk/client-chime-sdk-meetings";
import { Request, Response } from "express";
import { chime } from "../chime";

export const endMeeting = async (req: Request, res: Response) => {
  console.log(req.query);
  await chime.send(
    new DeleteAttendeeCommand({
      MeetingId: req.query.meetingId as string,
      AttendeeId: req.query.attendeeId as string,
    })
  );
  return "meeting ended";
};

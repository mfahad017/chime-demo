// @ts-nocheck
import {
  BatchUpdateAttendeeCapabilitiesExceptCommand,
  UpdateAttendeeCapabilitiesCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import { Request, Response } from "express";
import { chime } from "../chime";

const log = (comment: string, text: unknown) =>
  console.log(comment, JSON.stringify(text, null, 2));

export const muteAttendee = async (req: Request, res: Response) => {
  const attendeeInfo = await chime.send(
    new UpdateAttendeeCapabilitiesCommand({
      MeetingId: req.body.meetingId,
      AttendeeId: req.body.attendeeId,
      Capabilities: {
        Audio: "Receive",
        Video: "SendReceive",
        Content: "SendReceive",
      },
    })
  );
  log("Attendee Created", attendeeInfo);
  return res.status(200).json(attendeeInfo);
};

export const muteAllAttendees = async (req: Request, res: Response) => {
  console.log(
    "🚀 ~ file: mute-attendee.ts:37 ~ muteAllAttendees ~ req.body:",
    req.body
  );

  const attendeeInfo = await chime.send(
    new BatchUpdateAttendeeCapabilitiesExceptCommand({
      MeetingId: req.body.meetingId,
      ExcludedAttendeeIds: req.body.attendeeIds,
      Capabilities: {
        Audio: "Receive",
      },
    })
  );
  log("Attendee Created", attendeeInfo);
  return res.status(200).json(attendeeInfo);
};

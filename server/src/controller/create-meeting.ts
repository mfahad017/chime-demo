// @ts-nocheck
import {
  CreateAttendeeCommand,
  CreateMeetingCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import { Request, Response } from "express";
import { chime } from "../chime";
import { randomUUID } from "crypto";

const log = (comment: string, text: unknown) =>
  console.log(comment, JSON.stringify(text, null, 2));

async function createAttendee(meetingId: string) {
  console.log("Creating Attendee for Meeting: ", meetingId);
  try {
    const attendeeInfo = await chime.send(
      new CreateAttendeeCommand({
        MeetingId: meetingId,
        ExternalUserId: randomUUID(),
      })
    );
    log("Attendee Created", attendeeInfo);
    return attendeeInfo;
  } catch (err) {
    log("createAttendee error", err);
    return false;
  }
}

async function createMeeting(requestId: string) {
  console.log("Creating Meeting for Request ID: ", requestId);
  try {
    const meetingInfo = await chime.send(
      new CreateMeetingCommand({
        ClientRequestToken: requestId,
        MediaRegion: "us-east-1",
        ExternalMeetingId: requestId,
      })
    );
    log("Meeting Created", meetingInfo);
    return meetingInfo;
  } catch (err) {
    log("createMeeting error", err);
    return false;
  }
}

export const startMeeting = async (req: Request, res: Response) => {
  try {
    log("Time", new Date().toLocaleTimeString());

    const requestedMeeting = req.query.meetingId;

    console.log("Requested Meeting", requestedMeeting);
    // By using the requestedMeeting as the RequestToken,
    // if a meeting exists, a createMeeting will return
    // info for an existing meeting with the same RequestToken.
    // If no meeting exists with that RequestToken a new meeting
    // will be created.
    const meetingInfo = await createMeeting(requestedMeeting);

    if (meetingInfo) {
      const attendeeInfo = await createAttendee(
        meetingInfo.Meeting!.MeetingId!
      );

      if (attendeeInfo) {
        const responseInfo = {
          Meeting: meetingInfo.Meeting,
          Attendee: attendeeInfo.Attendee,
        };
        res.status(200).send(responseInfo);
        return;
      } else {
        res.status(503).send("Error creating Attendee");
        return;
      }
    } else {
      res.status(503).send("Error creating Meeting");
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

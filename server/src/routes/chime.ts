import { Router } from "express";
import { startMeeting } from "../controller/create-meeting";
import { endMeeting } from "../controller/end-meeting";
import { muteAllAttendees, muteAttendee } from "../controller/mute-attendee";

const router = Router();

router.get("/", startMeeting);
router.delete("/", endMeeting);
router.post("/mute", muteAttendee);
router.post("/mute-all", muteAllAttendees);

export default router;

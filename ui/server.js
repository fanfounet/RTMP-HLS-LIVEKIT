
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  RoomServiceClient,
  IngressClient,
  EgressClient,
  IngressInput,
  SegmentedFileOutput,
} from "livekit-server-sdk";

// --------------------------
// PATH FIX POUR ES MODULES
// --------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------
// LIVEKIT CONFIG
// --------------------------
const apiKey = "devkey";
const apiSecret = "secret";
const serverUrl = "http://livekit:7880";

// --------------------------
// EXPRESS APP
// --------------------------
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // dashboard.html servi à la racine

// --------------------------
// LIVEKIT CLIENTS
// --------------------------
const rooms = new RoomServiceClient(serverUrl, apiKey, apiSecret);
const ingress = new IngressClient(serverUrl, apiKey, apiSecret);
const egress = new EgressClient(serverUrl, apiKey, apiSecret);

// --------------------------
// API : CRÉATION ROOM
// --------------------------
app.post("/api/rooms", async (req, res) => {
  try {
    const room = await rooms.createRoom({ name: req.body.name });
    res.json(room);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --------------------------
// API : CRÉATION INGRESS RTMP
// --------------------------
app.post("/api/ingress", async (req, res) => {
  try {

    const inputType = IngressInput.RTMP_INPUT;

    const opts = {
      name: req.body.name || "rtmp-entry",
      roomName: req.body.room,
      participantIdentity: req.body.identity
    };

    const ig = await ingress.createIngress(inputType, opts);
    res.json(ig);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --------------------------
// API : START EGRESS HLS
// --------------------------
app.post("/api/egress/start", async (req, res) => {
  try {

const output = {
  segments: new SegmentedFileOutput({
    filenamePrefix: '/output/stream1',
    playlistName: 'index.m3u8',
    livePlaylistName: 'index-live.m3u8',
    segmentDuration: 1,
  }),
};

    const result = await egress.startParticipantEgress(req.body.room, req.body.identity, output);

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --------------------------
// API : STOP EGRESS
// --------------------------
app.post("/api/egress/stop", async (req, res) => {
  try {
    const stopped = await egress.stopEgress(req.body.egressId);
    res.json(stopped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --------------------------
// API : LISTS (monitoring)
// --------------------------
app.get("/api/rooms", async (req, res) => {
  try {
    res.json(await rooms.listRooms());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/rooms/:room/participants", async (req, res) => {
  try {
    res.json(await rooms.listParticipants(req.params.room));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/ingress", async (req, res) => {
  try {
    res.json(await ingress.listIngress({}));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/egress", async (req, res) => {
  try {
    res.json(await egress.listEgress({}));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --------------------------
// SERVE DASHBOARD
// --------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// --------------------------
// START SERVER
// --------------------------
app.listen(5000, () => {
  console.log("UI disponible sur http://localhost:5000/dashboard.html");
});

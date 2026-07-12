import { useSosSocket } from "../hooks/useSosSocket.js";
import { SosAlertList } from "../components/sos/SosAlertList.jsx";
import { Card } from "../components/ui/Card.jsx";

// Mission 5: the active dashboard for captain_2nd/captain_3rd (+ read-only
// for teacher) showing distress signals in real time (Hackathon Question.md
// Mission 5, API.md §11 GET /sos/active).
export const CaptainSosPage = () => {
  useSosSocket();

  return (
    <Card>
      <h1 className="mb-4 text-lg font-semibold text-slate-900">SOS Alerts</h1>
      <SosAlertList />
    </Card>
  );
};

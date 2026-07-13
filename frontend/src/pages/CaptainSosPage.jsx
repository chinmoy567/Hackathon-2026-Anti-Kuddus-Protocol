import { motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { useSosSocket } from "../hooks/useSosSocket.js";
import { SosAlertList } from "../components/sos/SosAlertList.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { fadeUp, staggerParent } from "../utils/motion.js";

// Mission 5: the active dashboard for captain_2nd/captain_3rd (+ read-only
// for teacher) showing distress signals in real time (Hackathon Question.md
// Mission 5, API.md §11 GET /sos/active).
export const CaptainSosPage = () => {
  useSosSocket();

  return (
    <motion.div className="space-y-6 sm:space-y-8" initial="hidden" animate="visible" variants={staggerParent}>
      <PageHeader
        icon={BellRing}
        eyebrow="SOS Alerts"
        title="SOS Alerts"
        description="Real-time distress signals from students, identity protected."
      />
      <motion.div variants={fadeUp}>
        <Card>
          <SosAlertList />
        </Card>
      </motion.div>
    </motion.div>
  );
};

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useGetStrikeStateQuery } from "../store/apiSlice.js";
import { selectCurrentUser } from "../store/authSlice.js";
import { StrikeProgressBar } from "../components/dashboard/StrikeProgressBar.jsx";
import { ImpeachedBanner } from "../components/dashboard/ImpeachedBanner.jsx";
import { ComplaintList } from "../components/complaints/ComplaintList.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { fadeUp, staggerParent } from "../utils/motion.js";

// The complaint list is a section of this page, not a separate route —
// API.md's "central dashboard" framing treats strike + complaint visibility
// as one screen for the roles that see both (Frontend.md FE-2).
const TRIAGE_ROLES = ["teacher", "captain_2nd", "captain_3rd"];

export const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetStrikeStateQuery();

  return (
    <motion.div className="space-y-6 sm:space-y-8" initial="hidden" animate="visible" variants={staggerParent}>
      <PageHeader
        icon={ShieldCheck}
        eyebrow="Dashboard"
        title={`Welcome back${user?.name ? `, ${user.name}` : ""}`}
        description="Live overview of warnings and complaint status."
      />

      <motion.div variants={fadeUp}>
        <Card>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : isError ? (
            <p className="text-sm text-rose-600">Failed to load strike status.</p>
          ) : data.impeached ? (
            <ImpeachedBanner />
          ) : (
            <StrikeProgressBar strikeCount={data.strikeCount} />
          )}
        </Card>
      </motion.div>

      {TRIAGE_ROLES.includes(user?.role) && (
        <motion.div variants={fadeUp}>
          <Card>
            <ComplaintList />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

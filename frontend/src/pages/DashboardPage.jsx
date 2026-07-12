import { useSelector } from "react-redux";
import { useGetStrikeStateQuery } from "../store/apiSlice.js";
import { selectCurrentUser } from "../store/authSlice.js";
import { StrikeProgressBar } from "../components/dashboard/StrikeProgressBar.jsx";
import { ImpeachedBanner } from "../components/dashboard/ImpeachedBanner.jsx";
import { ComplaintList } from "../components/complaints/ComplaintList.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";

// The complaint list is a section of this page, not a separate route —
// API.md's "central dashboard" framing treats strike + complaint visibility
// as one screen for the roles that see both (Frontend.md FE-2).
const TRIAGE_ROLES = ["teacher", "captain_2nd", "captain_3rd"];

export const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetStrikeStateQuery();

  return (
    <div className="space-y-8">
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

      {TRIAGE_ROLES.includes(user?.role) && (
        <Card>
          <ComplaintList />
        </Card>
      )}
    </div>
  );
};

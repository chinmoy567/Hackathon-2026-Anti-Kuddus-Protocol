import { useState } from "react";
import { useSendSosMutation } from "../../store/apiSlice.js";
import { SOS_LOCATIONS } from "../../utils/constants.js";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import { useToast } from "../ui/Toast.jsx";

// Mission 5 baseline: a prominent, mobile-friendly SOS trigger + location
// picker (Hackathon Question.md Mission 5). Fixed to the corner so it is
// reachable from anywhere in the student shell, not just one page.
export const SosButton = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [sendSos, { isLoading }] = useSendSosMutation();
  const { push } = useToast();

  const handleSend = async () => {
    if (!location) return;
    try {
      await sendSos({
        location,
        occurredAt: new Date().toISOString(),
        clientEventId: crypto.randomUUID(),
      }).unwrap();
      push("SOS sent. Captains have been alerted.", "success");
      setOpen(false);
      setLocation("");
    } catch (err) {
      push(err?.message || "Could not send SOS. Please try again.", "error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send SOS alert"
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full
          bg-rose-600 text-sm font-bold text-white shadow-lg transition-all duration-200 ease-out
          hover:bg-rose-500 active:scale-95 focus-visible:outline-none focus-visible:ring-4
          focus-visible:ring-rose-300"
      >
        SOS
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Send SOS Alert</h2>
            <p className="mt-1 text-sm text-slate-600">Select your current location. Captains will be notified instantly.</p>

            <Select
              key={open}
              id="sos-location"
              label="Location"
              placeholder="Select a location"
              options={SOS_LOCATIONS.map((loc) => ({ value: loc, label: loc }))}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-4"
            />

            <div className="mt-6 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleSend} disabled={!location} loading={isLoading}>
                Send SOS
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

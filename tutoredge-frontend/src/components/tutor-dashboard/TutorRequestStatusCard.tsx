import Button from "../ui/Button";

/* ======================
   TYPES
====================== */
interface Request {
  _id: string; // ✅ FIX: Mongo ID
  status:
    | "pending"
    | "contacted"
    | "assigned"
    | "completed"
    | "cancelled";
}

interface Props {
  request: Request;
  onRequestToTeach: (id: string) => void;
}

/* ======================
   COMPONENT
====================== */
export default function TutorRequestStatusCard({
  request,
  onRequestToTeach,
}: Props) {
  // 🟡 Pending → tutor can apply
  if (request.status === "pending") {
    return (
      <Button onClick={() => onRequestToTeach(request._id)}>
        Request to Teach
      </Button>
    );
  }

  // 🟠 Tutor already contacted admin
  if (request.status === "contacted") {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
        ✅ <b>Your request has been sent to admin.</b>
        <br />
        Admin is reviewing your profile.
      </div>
    );
  }

  // 🔵 Assigned to another tutor
  if (request.status === "assigned") {
    return (
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        ℹ️ <b>This request is currently assigned to another tutor.</b>
        <br />
        If the assigned tutor rejects or is unavailable,
        <br />
        <b>you may be contacted for a demo.</b>
      </div>
    );
  }

  // 🟢 Completed
  if (request.status === "completed") {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        🎉 <b>This request has been completed.</b>
        <br />
        Demo session already conducted.
      </div>
    );
  }

  // 🔴 Cancelled
  if (request.status === "cancelled") {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
        
        ❌ <b>This request has been cancelled by admin.</b>
      </div>
    );
  }

  return null;
}

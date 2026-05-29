import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  /**
   * FETCH NOTIFICATIONS
   */
  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.get(
        `http://localhost:4000/api/notifications/${user.id}`
      );

      setNotifications(res.data);
    } catch (err) {
      console.log("NOTIFICATION ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // auto refresh every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  /**
   * MARK AS READ
   */
  const markAsRead = async (id: string) => {
    try {
      await axios.post(
        `http://localhost:4000/api/notifications/${id}/read`
      );

      fetchNotifications();
    } catch (err) {
      console.log("MARK READ ERROR:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* BELL BUTTON */}
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <b>({unreadCount})</b>}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            width: 300,
            padding: 10,
            zIndex: 1000,
          }}
        >
          <h4>Notifications</h4>

          {notifications.length === 0 && <p>No notifications</p>}

          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: 8,
                borderBottom: "1px solid #eee",
                background: n.read ? "#f5f5f5" : "#fff",
              }}
            >
              <p style={{ margin: 0 }}>{n.message}</p>

              {!n.read && (
                <button onClick={() => markAsRead(n.id)}>
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { alertsAPI } from "../services/api";
import { Alert as AlertType } from "../types";
import { Badge } from "./ui/badge";
import { Bell } from "lucide-react";

export const AlertsTicker = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const LoadAlerts = async () => {
      try {
        const data = await alertsAPI.getAlerts(); // Only Shows recent unread Alerts

        setAlerts(data.filter((alert) => !alert.isRead).slice(0, 5));
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    LoadAlerts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex: number) => (prevIndex + 1) % alerts.length);
    }, 5000); // Change alert every 5 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex];

  return (
    <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-l-4 border-accent px-6 py-3 overflow-hidden">
      <div className="flex items-center space-x-4 animate-in fade-in duration-500">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Bell className="w-4 h-4 text-accent animate-pulse" />
          <span className="font-medium text-foreground">Latest Alert:</span>
        </div>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Badge variant="outline" className="flex-shrink-0">
            {currentAlert.country}
          </Badge>
          <p className="text-sm text-foreground truncate">
            {currentAlert.title}
          </p>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {alerts.map((_: AlertType, index: number) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-accent w-6" : "bg-accent/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

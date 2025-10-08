import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

export default function Timer({ initialSeconds, onTimeUp }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-2" data-testid="timer-display">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <span className={`text-2xl font-mono font-semibold ${seconds < 300 ? 'text-destructive' : 'text-foreground'}`}>
        {formatTime(minutes)}:{formatTime(remainingSeconds)}
      </span>
    </div>
  );
}

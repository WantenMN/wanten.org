import { Link } from "@tanstack/react-router";

interface DateNavigationProps {
  type: "year" | "month" | "day";
  currentYear?: number;
  currentMonth?: number;
  currentDay?: number;
}

const DateNavigation = ({
  type,
  currentYear,
  currentMonth,
  currentDay,
}: DateNavigationProps) => {
  const getDisplayText = () => {
    if (type === "year" && currentYear) {
      return currentYear.toString();
    }
    if (type === "month" && currentMonth) {
      return String(currentMonth).padStart(2, "0");
    }
    if (type === "day" && currentDay) {
      return String(currentDay).padStart(2, "0");
    }
    return "";
  };

  if (type === "year") {
    return (
      <Link
        to="/years"
        className="text-foreground hover:text-muted-foreground text-2xl font-bold hover:underline focus:outline-none"
      >
        {getDisplayText()}
      </Link>
    );
  }

  if (type === "month" && currentYear) {
    return (
      <Link
        to="/$year/months"
        params={{ year: String(currentYear) }}
        className="text-foreground hover:text-muted-foreground text-2xl font-bold hover:underline focus:outline-none"
      >
        {getDisplayText()}
      </Link>
    );
  }

  if (type === "day" && currentYear && currentMonth) {
    return (
      <Link
        to="/$year/$month/days"
        params={{
          year: String(currentYear),
          month: String(currentMonth).padStart(2, "0"),
        }}
        className="text-foreground hover:text-muted-foreground text-2xl font-bold hover:underline focus:outline-none"
      >
        {getDisplayText()}
      </Link>
    );
  }

  return <>{getDisplayText()}</>;
};

export default DateNavigation;

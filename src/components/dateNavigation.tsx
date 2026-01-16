import Link from "next/link";

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

  const getHref = () => {
    if (type === "year") {
      return "/years";
    }
    if (type === "month" && currentYear) {
      return `/${currentYear}/months`;
    }
    if (type === "day" && currentYear && currentMonth) {
      return `/${currentYear}/${String(currentMonth).padStart(2, "0")}/days`;
    }
    return "#";
  };

  return (
    <Link
      href={getHref()}
      className="text-2xl font-bold text-black hover:text-zinc-600 hover:underline focus:outline-none"
    >
      {getDisplayText()}
    </Link>
  );
};

export default DateNavigation;

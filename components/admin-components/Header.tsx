import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
      {/* Greeting and Subtitle */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-dark-400">
          Welcome back, {session?.user?.fullName}!
        </h2>
        <p className="text-base text-slate-500 mt-1">
          {session?.user.role === "admin"
            ? "Monitor all startups"
            : "Track your startup's progress and manage your profile."}
        </p>
      </div>
    </header>
  );
};

export default Header;

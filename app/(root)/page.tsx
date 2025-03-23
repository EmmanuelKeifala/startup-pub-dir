import { getAllStartUps } from "@/actions/helper-actions";
import {
  StartUpOverview,
  StartUpList,
} from "@/components/app-components/index";
import { Startup } from "@/types/general";
import Link from "next/link";

export default async function Home() {
  const startupsFromDB = await getAllStartUps();

  const hasStartups = startupsFromDB && startupsFromDB.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 gap-4">
      {hasStartups ? (
        <>
          <StartUpOverview {...(startupsFromDB[0] as Startup)} />

          <StartUpList
            title="New StartUps"
            startups={startupsFromDB as Startup[]}
            containerClassName="mt-28"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className=" rounded-lg p-10 w-full max-w-xl shadow-sm">
            <h1 className="text-white text-2xl font-bold mb-4">
              No startups found
            </h1>
            <p className="text-gray-600 mb-6">
              There are currently no startups in the database.
            </p>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-accent rounded-md hover:bg-accent/40 transition-colors"
            >
              Add Your First Startup
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

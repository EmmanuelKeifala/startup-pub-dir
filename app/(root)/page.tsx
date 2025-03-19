import { getAllStartUps } from "@/actions/helper-actions";
import {
  StartUpOverview,
  StartUpList,
} from "@/components/app-components/index";

export default async function Home() {
  const startupsFromDB = await getAllStartUps();

  return (
    <div>
      <StartUpOverview {...startupsFromDB[0]} />

      <StartUpList
        title="New StartUps"
        startups={startupsFromDB}
        containerClassName="mt-28"
      />
    </div>
  );
}

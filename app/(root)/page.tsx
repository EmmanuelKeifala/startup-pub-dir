import {
  StartUpOverview,
  StartUpList,
} from "@/components/app-components/index";
import startups from "@/dummy";

export default function Home() {
  return (
    <div>
      <StartUpOverview {...startups[0]} />

      <StartUpList
        title="New StartUps"
        startups={startups}
        containerClassName="mt-28"
      />
    </div>
  );
}

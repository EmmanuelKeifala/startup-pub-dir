import { addStartUpService } from "@/actions/helper-actions";
import { ServiceForm } from "@/components/app-components/ServiceForm";
import React from "react";

type StartUpProps = Promise<{ startupId: string }>;

async function Addservice({ params }: { params: StartUpProps }) {
  const { startupId: id } = await params;

  return (
    <div>
      <ServiceForm startupId={id} onSubmit={addStartUpService} type="create" />
    </div>
  );
}

export default Addservice;

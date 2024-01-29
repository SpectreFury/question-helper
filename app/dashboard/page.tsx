import React from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Dashboard = () => {
  return (
    <div className="w-full">
      <Container>
        <div className="flex flex-col items-center mt-[100px] gap-6">
          <Image
            src="/dashboard-light.svg"
            width={250}
            height={250}
            alt="Dashboard light"
            className="dark:hidden"
          />
          <Image
            src="/dashboard-dark.svg"
            width={250}
            height={250}
            alt="Dashboard dark"
            className="hidden dark:block"
          />
          <Button>Create a workspace</Button>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;

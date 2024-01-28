"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { ButtonLoading } from "@/components/button-loading";
import { useRouter } from "next/navigation";

const Home = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center gap-2">
      <div className="mt-[200px] font-bold text-[28px]">
        The best way of getting ready for your tests
      </div>
      {isAuthenticated ? (
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Enter Dashboard
        </Button>
      ) : (
        <React.Fragment>
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <SignInButton>
              <Button>Enter Dashboard</Button>
            </SignInButton>
          )}
        </React.Fragment>
      )}
    </main>
  );
};

export default Home;

import React from "react";
import Container from "@/components/container";
import TopicForm from "../_components/topic-form";

const Dashboard = () => {
  return (
    <div className="w-full">
      <Container>
        <TopicForm />
      </Container>
    </div>
  );
};

export default Dashboard;

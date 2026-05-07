import { useEffect } from "react";
import ChatBot from "../components/ChatBot";
import { markSectionVisited } from "../services/api";

function ChatbotPage() {
  useEffect(() => {
    markSectionVisited("AI Chatbot");
  }, []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <h1 className="section-title">AI Chatbot</h1>
      <p className="section-subtitle">
        Savol yuboring, sun'iy intellektdan javob oling yoki rasm yuklab
        kompyuter qurilmasi bo'yicha tahlil natijasini ko'ring.
      </p>
      <div className="mt-8">
        <ChatBot />
      </div>
    </section>
  );
}

export default ChatbotPage;

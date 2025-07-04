"use client";

import { useEffect, useState } from "react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { sendChat } from "@/api/services/ai.service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { promptSchema } from "@/api/schemas/ai.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";

interface Message {
  id: number;
  message: string;
  sender: "user" | "bot";
  isLoading?: boolean;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentId, setCurrentId] = useState<number>(1);


  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
      asProfessor: true,
      newChat: false,
    },
  });

  async function onSubmit(values: z.infer<typeof promptSchema>) {
    const userId = currentId;
    const botId = currentId + 1;
    setCurrentId((id) => id + 2);

    const message: Message = {
      id: userId,
      message: values.prompt,
      sender: "user",
      isLoading: false,
    };

    const botMessage: Message = {
      id: botId,
      message: "",
      sender: "bot",
      isLoading: true,
    };

    setMessages((msgs) => msgs.concat(message, botMessage));

    const response = await sendChat({ prompt: values.prompt });
    const chat = await response.json();

    setMessages((msgs) =>
      msgs.map((msg) => {
        if (msg.id === botId) {
          return { ...msg, message: chat.response, isLoading: false };
        } else return msg;
      }),
    );

    form.reset();
  }

  useEffect(() => {
    async function fetchInitialMessage() {
      const message: Message = {
        id: 1,
        message: "",
        sender: "bot",
        isLoading: true,
      };
      setMessages((msgs) => msgs.concat(message));

      const initial = {
        prompt: "Apakah ada tugas yang belum selesai?",
        newChat: true,
        asProfessor: true,
      };

      const response = await sendChat(initial);
      const chat = await response.json();
      setMessages((msgs) =>
        msgs.map((msg) => {
          if (msg.id === 1) {
            return { ...msg, message: chat.response, isLoading: false };
          } else return msg;
        }),
      );

      setCurrentId((id) => id++);
    }

    fetchInitialMessage();
  }, []);

  return (
    <div className="space-y-16">
      <ChatMessageList>
        {messages.map((message, index) => {
          const variant = message.sender === "user" ? "sent" : "received";
          return (
            <ChatBubble key={`message-${index}`} variant={variant}>
              <ChatBubbleAvatar fallback={variant === "sent" ? "US" : "JD"} />
              <ChatBubbleMessage
                isLoading={message.isLoading}
                className={message.sender === "user" ? "bg-sky-400" : ""}
              >
                {message.message}
              </ChatBubbleMessage>
            </ChatBubble>
          );
        })}
      </ChatMessageList>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background focus-within:ring-ring relative space-y-4 rounded-lg border p-1 focus-within:ring-1"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="bg-transparent">
                <FormControl>
                  <ChatInput
                    placeholder="Type your message here..."
                    className="min-h-36 resize-none rounded-lg border-0 bg-transparent p-3 shadow-none focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center p-3 pt-0">
            <Button size="sm" className="ml-auto gap-1.5" type="submit">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

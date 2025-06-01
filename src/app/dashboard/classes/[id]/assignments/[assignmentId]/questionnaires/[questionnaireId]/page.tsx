"use client";

import { createAnswer } from "@/api/services/answer.service";
import { getQuestionnaire } from "@/api/services/questionnaire.service";
import { createAnswerSchema } from "@/api/schemas/answer.schema";
import {
  Questionnaire,
  questionnaireSchema,
} from "@/api/schemas/questionnaire.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

export default function StudentQuestionnairePage() {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id, assignmentId, questionnaireId } = params;

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof createAnswerSchema>>({
    resolver: zodResolver(createAnswerSchema),
    defaultValues: {
      answers: [],
    },
  });

  useEffect(() => {
    async function fetchQuestionnaire() {
      try {
        const response = await getQuestionnaire(
          Number(id),
          Number(assignmentId),
          Number(questionnaireId),
        );

        const fetchedQuestionnaire = questionnaireSchema.parse(
          await response.json(),
        );

        setQuestionnaire(fetchedQuestionnaire);

        // Initialize form with default values based on fetched questionnaire
        form.reset({
          answers: fetchedQuestionnaire.questions.map((question) => ({
            questionId: question.id,
            answer: -1, // Default to unselected
          })),
        });
      } catch (error) {
        console.error("Failed to fetch questionnaire:", error);
        toast.error("Failed to load questionnaire");
      }
    }

    fetchQuestionnaire();
  }, [assignmentId, form, id, questionnaireId]);

  const onSubmit = async (data: z.infer<typeof createAnswerSchema>) => {
    if (!questionnaire) return;

    setIsSubmitting(true);

    try {
      // Validate all questions have been answered
      const unanswered = data.answers.filter((a) => a.answer === -1);
      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting");
        return;
      }

      // Create submission
      await createAnswer(
        Number(id),
        Number(assignmentId),
        Number(questionnaireId),
        data,
      );

      toast.success("Questionnaire submitted successfully!");

      // Redirect back to assignment page
      router.push(`/dashboard/classes/${id}/assignments/${assignmentId}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit questionnaire. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questionnaire) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <Link
          href={`/dashboard/classes/${id}/assignments/${assignmentId}`}
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Assignment
        </Link>
        <Card>
          <CardContent className="p-4 text-center">
            <p>Loading questionnaire...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Link
        href={`/dashboard/classes/${id}/assignments/${assignmentId}`}
        className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Assignment
      </Link>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Questionnaire</CardTitle>
        </CardHeader>
      </Card>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {questionnaire.questions.map((q, index) => (
          <Card key={q.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Question {index + 1}
              </CardTitle>
              <p className="text-base">{q.question}</p>
            </CardHeader>

            <CardContent>
              <RadioGroup
                onValueChange={(value) => {
                  form.setValue(`answers.${index}.answer`, Number(value));
                }}
                className="space-y-2"
              >
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className="hover:bg-accent flex items-center space-x-3 rounded border p-3"
                  >
                    <RadioGroupItem
                      value={String(optIndex)}
                      id={`q${q.id}-opt${optIndex}`}
                    />
                    <label
                      htmlFor={`q${q.id}-opt${optIndex}`}
                      className="w-full cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
          </Button>
        </div>
      </form>
    </div>
  );
}

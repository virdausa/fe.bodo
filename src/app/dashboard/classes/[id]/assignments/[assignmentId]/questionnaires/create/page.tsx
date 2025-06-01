"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { createQuestionnaire } from "@/api/services/questionnaire.service";
import { toast } from "sonner";
import Link from "next/link";

const questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
});

type Question = z.infer<typeof questionSchema>;

interface AddQuestionModalProps {
  currentId: number;
  addQuestion: (question: Question) => void;
}

function AddQuestionModal({ currentId, addQuestion }: AddQuestionModalProps) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      id: currentId,
      question: "",
      options: ["", "", "", ""],
      correct: 0,
    },
  });

  const { setValue, getValues } = form;

  function handleOptionChange(index: number, value: string) {
    const options = [...getValues("options")];
    options[index] = value;
    setValue("options", options);
  }

  function handleSubmit(values: z.infer<typeof questionSchema>) {
    addQuestion(values);
    setOpen(false);
    form.reset({
      id: currentId + 1,
      question: "",
      options: ["", "", "", ""],
      correct: 0,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Question</Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>Add a question</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>This is the question</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                {form.watch("options").map((option, index) => (
                  <FormItem key={index}>
                    <FormLabel>{`Option ${index + 1}`}</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full rounded border px-3 py-2"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                ))}
              </div>

              <FormField
                control={form.control}
                name="correct"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                        className="flex flex-col gap-2"
                      >
                        {form.watch("options").map((option, index) => (
                          <FormItem
                            key={index}
                            className="flex items-center gap-3"
                          >
                            <FormControl>
                              <RadioGroupItem value={String(index)} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option || `Option ${index + 1}`}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Add Question
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditQuestionModalProps {
  question: Question;
  updateQuestion: (updated: Question) => void;
}

function EditQuestionModal({
  question,
  updateQuestion,
}: EditQuestionModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues: { ...question },
  });

  const { setValue, getValues } = form;

  function handleOptionChange(index: number, value: string) {
    const options = [...getValues("options")];
    options[index] = value;
    setValue("options", options);
  }

  function handleSubmit(values: Question) {
    updateQuestion(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-125 overflow-scroll md:max-h-150">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>Modify the question</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Edit the question text</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                {form.watch("options").map((option, index) => (
                  <FormItem key={index}>
                    <FormLabel>{`Option ${index + 1}`}</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full rounded border px-3 py-2"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                ))}
              </div>

              <FormField
                control={form.control}
                name="correct"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                        className="flex flex-col gap-2"
                      >
                        {form.watch("options").map((option, index) => (
                          <FormItem
                            key={index}
                            className="flex items-center gap-3"
                          >
                            <FormControl>
                              <RadioGroupItem value={String(index)} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option || `Option ${index + 1}`}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-fit hover:cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateQuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);

  const params = useParams();
  const { id, assignmentId } = params;

  const router = useRouter();

  function addQuestion(question: Question) {
    setQuestions((q) => q.concat(question));
    setCurrentQuestionId((id) => id++);
  }

  function updateQuestion(updated: Question) {
    setQuestions((qs) => qs.map((q) => (q.id === updated.id ? updated : q)));
  }

  function deleteQuestion(id: number) {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  }

  async function onCreate() {
    async function handler() {
      const response = await createQuestionnaire(
        Number(id),
        Number(assignmentId),
        { questions },
      );

      if (response.ok) {
        return router.push(
          `/dashboard/classes/${id}/assignments/${assignmentId}`,
        );
      }
    }

    toast.promise(handler, {
      loading: "Creating questionnaire...",
      success: "Questionnaire has been created",
      error: "There is an error while trying to create questionnaire",
    });
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <Link
        href={`/dashboard/classes/${id}/assignments/${assignmentId}`}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        <small className="text-sm">Return</small>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create a questionnaire</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-end">
          <AddQuestionModal
            addQuestion={addQuestion}
            currentId={currentQuestionId}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 md:gap-4">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {`Q${idx + 1}: ${q.question}`}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <EditQuestionModal
                  question={q}
                  updateQuestion={updateQuestion}
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive">
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this question?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently remove the question.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteQuestion(q.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {q.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded border px-3 py-2 ${
                    index === q.correct
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-300"
                  }`}
                >
                  <span>{option}</span>
                  {index === q.correct && (
                    <span className="text-sm font-medium text-green-600">
                      ✓ Correct
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="w-full" onClick={onCreate}>
        Create Questionnaire
      </Button>
    </div>
  );
}

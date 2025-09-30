import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const options = [
    { value: "A", text: question.optionA },
    { value: "B", text: question.optionB },
    { value: "C", text: question.optionC },
    { value: "D", text: question.optionD },
  ];

  return (
    <Card className="bg-card border-border" data-testid="question-card">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <h4 className="text-lg font-medium text-foreground mb-4">
            {question.questionText}
          </h4>
        </div>

        <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`option-${option.value}`}
                  data-testid={`option-${option.value}`}
                />
                <Label 
                  htmlFor={`option-${option.value}`}
                  className="flex-1 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <span className="font-medium mr-2">{option.value}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

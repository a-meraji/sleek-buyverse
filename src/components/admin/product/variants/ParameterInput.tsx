import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MinusCircle } from "lucide-react";

interface ParameterInputProps {
  newParameterKey: string;
  onParameterKeyChange: (value: string) => void;
  onAddParameter: () => void;
  definedParameters: string[];
  onRemoveParameter: (param: string) => void;
}

export function ParameterInput({
  newParameterKey,
  onParameterKeyChange,
  onAddParameter,
  definedParameters,
  onRemoveParameter,
}: ParameterInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="New parameter name (e.g., Size, Color, Weight)"
          value={newParameterKey}
          onChange={(e) => onParameterKeyChange(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          type="button" 
          onClick={onAddParameter} 
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      {definedParameters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {definedParameters.map(param => (
            <div 
              key={param}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1"
            >
              {param}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onRemoveParameter(param)}
              >
                <MinusCircle className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampaignFormData } from "../types";

interface CampaignBasicInfoProps {
  register: UseFormRegister<CampaignFormData>;
}

export function CampaignBasicInfo({ register }: CampaignBasicInfoProps) {
  return (
    <>
      <div>
        <Label htmlFor="title">Campaign Title</Label>
        <Input id="title" {...register("title", { required: true })} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
    </>
  );
}
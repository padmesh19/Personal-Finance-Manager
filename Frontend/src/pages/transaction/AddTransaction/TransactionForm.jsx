import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";

export const TransactionForm = ({ inputData, categories }) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            onChange={(e) => {
              inputData("amount", e.target.value);
            }}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="spent" className="text-right">
            Date
          </Label>
          <div className="col-span-3">
            <DatePicker
              setValue={(val) => {
                inputData("date", val);
              }}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <div className="col-span-3">
            <Input
              id="description"
              type="text"
              onChange={(e) => {
                inputData("description", e.target.value);
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-4 items-center gap-4">
          <Label htmlFor="" className="text-right">
            Category
          </Label>
          <div className="col-span-3">
            <Select onValueChange={(e) => inputData("category_id", e)}>
              <SelectTrigger className="h-9 bg-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryForm from "./CategoryForm";
import AddCategoryForm from "./AddCategoryForm";
import CategoryDelete from "./CategoryDelete";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";

export default function CategoryList() {
  const { categories, isLoading, error } = useSelector(
    (state) => state.category
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [data, setData] = useState(null);

  const toggle = () => {
    setIsOpen(!isOpen);
    setData(null);
  };

  const deleteToggle = () => {
    setIsDeleteOpen(!isDeleteOpen);
    setData(null);
  };

  const addToggle = () => {
    setIsAddOpen(!isAddOpen);
    setData("");
  };

  return (
    <>
      <>
        <div className="flex justify-center items-start">
          <div className="h-fit max-h-[80vh] w-full flex flex-col gap-4 px-10">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xl font-semibold">Categories</span>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setIsAddOpen(true);
                }}
              >
                <Plus />
                Add Custom Category
              </Button>
            </div>
            {!!categories.length && (
              <div className=" bg-white rounded-lg py-4 px-4 overflow-y-auto">
                <Table>
                  <TableHeader className="[&_tr]:!border-0 bg-slate-200">
                    <TableRow>
                      <TableHead className="text-slate-800 font-medium">
                        S.NO
                      </TableHead>
                      <TableHead className="text-slate-800 font-medium">
                        Category Name
                      </TableHead>
                      <TableHead className="text-slate-800 font-medium">
                        Category Type
                      </TableHead>
                      <TableHead className="w-12 text-slate-800 font-medium text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&_tr]:!border-l-0 [&_tr]:!border-r-0">
                    {categories.map((category, index) => (
                      <TableRow
                        key={category._id}
                        className="border-b-slate-100"
                      >
                        <TableCell className="text-slate-800 font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-slate-800 font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-slate-800 font-normal">
                          <Badge
                            variant={
                              category.category_type == "income"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {category.category_type.charAt(0).toUpperCase() +
                              category.category_type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-center items-center gap-2">
                          {category.user_id ? (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setData(category);
                                  setIsOpen(true);
                                }}
                                className="w-10 hover:bg-slate-100"
                              >
                                <Pencil />
                              </Button>
                              <Button
                                variant="destructive"
                                className="w-10"
                                onClick={() => {
                                  setData(category);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </>
                          ) : (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {!categories.length && (
              <div className=" bg-white min-h-[70vh] rounded-lg py-4 px-4 overflow-y-auto flex items-center justify-center">
                <div className="max-h-screen h-full no-scrollbar">
                  <div className="text-slate-700 text-bold text-xl">
                    No Data
                  </div>
                </div>
              </div>
            )}
            <CategoryForm isOpen={isOpen} toggle={toggle} data={data} />
            <CategoryDelete
              isDeleteOpen={isDeleteOpen}
              deleteToggle={deleteToggle}
              data={data}
            />
            <AddCategoryForm isAddOpen={isAddOpen} addToggle={addToggle} />
          </div>
        </div>
      </>
    </>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchableDropdown from "./SearchableDropdown";

type PickerFetchFn<T> = (q: string) => Promise<{ status: string; data: T[] } | null>;

interface EntityPickerProps<T> {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
  onConfirm: (selectedIds: string[]) => void;
  title: string;
  searchPlaceholder: string;
  fetcher: PickerFetchFn<T>;
  queryKeyBase: string;
  getItemId: (item: T) => string;
  getItemDisplay: (item: T) => string;
  getItemSubtext?: (item: T) => string;
}

export default function EntityPicker<T>({
  isOpen,
  onClose,
  selectedItems,
  onConfirm,
  title,
  searchPlaceholder,
  fetcher,
  queryKeyBase,
  getItemId,
  getItemDisplay,
  getItemSubtext,
}: EntityPickerProps<T>) {
  const [q, setQ] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: [queryKeyBase, "picker", { q }],
    queryFn: () => fetcher(q),
    enabled: isOpen,
  });

  const items = (data?.data || []) as T[];

  return (
    <SearchableDropdown<T>
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      isLoading={isFetching}
      selectedItems={selectedItems}
      onConfirm={onConfirm}
      getItemId={getItemId}
      getItemDisplay={getItemDisplay}
      getItemSubtext={getItemSubtext}
      title={title}
      searchPlaceholder={searchPlaceholder}
      onSearchChange={setQ}
    />
  );
}



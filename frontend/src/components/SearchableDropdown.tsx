import { useState, useMemo, useEffect } from "react";
import { X, Search, Check } from "lucide-react";

interface SearchableDropdownProps<T> {
  isOpen: boolean;
  onClose: () => void;
  items: T[];
  isLoading?: boolean;
  selectedItems: string[];
  onConfirm: (selectedIds: string[]) => void;
  getItemId: (item: T) => string;
  getItemDisplay: (item: T) => string;
  getItemSubtext?: (item: T) => string;
  title: string;
  searchPlaceholder?: string;
  searchKey?: (item: T) => string;
  /**
   * If provided, we treat the search box as "server-side search":
   * we call this callback and DO NOT filter client-side.
   */
  onSearchChange?: (query: string) => void;
}

export default function SearchableDropdown<T>({
  isOpen,
  onClose,
  items,
  isLoading = false,
  selectedItems,
  onConfirm,
  getItemId,
  getItemDisplay,
  getItemSubtext,
  title,
  searchPlaceholder = "Search...",
  searchKey,
  onSearchChange,
}: SearchableDropdownProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);

  // Initialize tempSelected when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedItems);
      setSearchQuery("");
    }
  }, [isOpen, selectedItems]);

  // Server-side search hook (optional)
  useEffect(() => {
    if (!isOpen) return;
    if (onSearchChange) onSearchChange(searchQuery);
  }, [isOpen, searchQuery, onSearchChange]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    // If server-side search is used, the parent already filtered `items`
    if (onSearchChange) return items;

    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const searchText = searchKey 
        ? searchKey(item).toLowerCase()
        : getItemDisplay(item).toLowerCase();
      return searchText.includes(query);
    });
  }, [items, searchQuery, getItemDisplay, searchKey, onSearchChange]);

  const handleToggleItem = (id: string) => {
    setTempSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedItems);
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No items found</p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const id = getItemId(item);
                const isSelected = tempSelected.includes(id);
                return (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{getItemDisplay(item)}</p>
                      {getItemSubtext && (
                        <p className="text-xs text-slate-600 mt-0.5">{getItemSubtext(item)}</p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleItem(id)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {tempSelected.length} item{tempSelected.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


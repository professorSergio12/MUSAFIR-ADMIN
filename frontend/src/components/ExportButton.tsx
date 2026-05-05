import { useState } from "react";
import { Download, X } from "lucide-react";

interface ExportButtonProps {
  onExport: (exportType: "all" | "current") => Promise<any>;
  fileNamePrefix?: string;
  modalTitle?: string;
  buttonText?: string;
  buttonClassName?: string;
}

export default function ExportButton({
  onExport,
  fileNamePrefix = "data",
  modalTitle = "Export Data",
  buttonText = "Export",
  buttonClassName = "border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md transition flex items-center gap-2 text-sm font-medium",
}: ExportButtonProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"all" | "current">("all");

  const handleExportClick = async () => {
    try {
      const response = await onExport(exportType);
      if (response) {
        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileNamePrefix}_${exportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setShowExportModal(false);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowExportModal(true)}
        className={buttonClassName}
      >
        <Download className="w-4 h-4" /> {buttonText}
      </button>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-slate-200 relative">
            <button
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition"
              onClick={() => setShowExportModal(false)}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              {modalTitle}
            </h2>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="exportType"
                    value="all"
                    checked={exportType === "all"}
                    onChange={(e) => setExportType(e.target.value as "all" | "current")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Export All Data</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="exportType"
                    value="current"
                    checked={exportType === "current"}
                    onChange={(e) => setExportType(e.target.value as "all" | "current")}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Export Only Current View</span>
                </label>
              </div>

              <button
                onClick={handleExportClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md transition font-medium text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


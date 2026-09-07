import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  RefreshCw, 
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

export default function DataIngestion() {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, validated, retraining, done
  const [logs, setLogs] = useState([]);

  const handleSimulateUpload = () => {
    setUploadStatus('uploading');
    setLogs([
      "Reading CUF_Monthly_Drop_April_2026.xlsx...",
      "Extracted 1,981 project rows across 17 Ministries."
    ]);

    setTimeout(() => {
      setUploadStatus('validated');
      setLogs(prev => [
        ...prev,
        "Running Automated Schema & Validation Engine...",
        "✔ 1,965 rows passed unit sanity check.",
        "⚠️ 16 rows flagged with missing land acquisition coordinates.",
        "✔ Approved cost vs revised cost ratio computed for all rows.",
        "Validation complete! Data ready for model re-scoring."
      ]);
    }, 1500);
  };

  const handleSimulateRetrain = () => {
    setUploadStatus('retraining');
    setLogs(prev => [
      ...prev,
      "Initiating LightGBM & XGBoost Retraining Pipeline...",
      "Splitting 80/20 train/test dataset on 2006-2026 OCMS historical series...",
      "Evaluating SHAP feature importance vectors...",
      "✔ Model Retraining Complete: Test RMSE improved from 9.4% to 9.2%.",
      "New model weights deployed to FastAPI microservice container."
    ]);
    setTimeout(() => {
      setUploadStatus('done');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileSpreadsheet className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              CUF Data Ingestion & Model Retraining Studio
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Ingest monthly Common Upload Form (CUF) updates from implementing agencies, run automated validation checks, and trigger model re-scoring cycles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload Zone */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-orange-600" />
            <span>Upload Monthly CUF Dataset (Excel / CSV)</span>
          </h3>

          <div 
            onClick={uploadStatus === 'idle' ? handleSimulateUpload : undefined}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              uploadStatus === 'validated' || uploadStatus === 'done'
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-300 hover:border-orange-500 hover:bg-orange-50/30'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 font-outfit">
              {uploadStatus === 'idle' && "Drop CUF File Here or Click to Browse"}
              {uploadStatus === 'uploading' && "Uploading & Reading Sheets..."}
              {(uploadStatus === 'validated' || uploadStatus === 'done') && "CUF_Monthly_Drop_April_2026.xlsx Validated"}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard MoSPI Common Upload Form schema (1,981 projects)
            </p>

            {uploadStatus === 'validated' && (
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulateRetrain();
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Trigger ML Retraining & Rescore Projects</span>
                </button>
              </div>
            )}
          </div>

          {/* Validation Rules Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Automated ETL Validation Checks</span>
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside font-medium">
              <li>Check 1: Revised cost must be &ge; Original approved cost.</li>
              <li>Check 2: Financial expenditure &le; Revised sanctioned cost.</li>
              <li>Check 3: Date of Commissioning (DOC) must be a valid future ISO string.</li>
              <li>Check 4: Land acquisition percentage bounded between 0% and 100%.</li>
            </ul>
          </div>
        </div>

        {/* Console Execution Logs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit mb-3 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-orange-600" />
              <span>ETL Ingestion & ML Pipeline Console Logs</span>
            </h3>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 space-y-2 h-72 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic">Console output will appear here upon upload...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-orange-400 text-[10px] font-bold">&gt;</span>
                    <span className={log.includes('✔') ? 'text-emerald-400 font-semibold' : log.includes('⚠️') ? 'text-amber-300' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 font-medium">
            PAIMANA-AI Data Pipeline v2.4 • Apache Airflow DAG Orchestrated
          </div>
        </div>

      </div>
    </div>
  );
}

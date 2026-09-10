import React, { useState } from 'react';
import { FPO_CLUSTERS } from '../../data/mockData';
import { FpoCluster } from '../../types';
import { Users, Phone, MapPin, Building, ShieldCheck, X, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

interface FpoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrict?: string;
}

export const FpoModal: React.FC<FpoModalProps> = ({ isOpen, onClose }) => {
  const [selectedFpo, setSelectedFpo] = useState<FpoCluster | null>(null);

  if (!isOpen) return null;

  const handleCloseAll = () => {
    setSelectedFpo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-300 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {selectedFpo ? (
              <button
                type="button"
                onClick={() => setSelectedFpo(null)}
                className="h-12 px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 border border-emerald-600 shadow-md transition-all active:scale-95"
                title="Back to FPO List"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>⬅️ Back to FPO List</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">Local FPO Aggregation Clusters</h3>
                  <p className="text-[11px] text-emerald-200">Telugu States (Andhra Pradesh & Telangana)</p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCloseAll}
            className="h-10 px-3 py-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            <span>Close</span>
            <X className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {selectedFpo ? (
          /* DETAILED SINGLE FPO VIEW */
          <div className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs text-stone-800">
            {/* Standardized Sticky Top Header Bar */}
            <div className="sticky top-0 bg-white z-50 flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <button 
                onClick={() => { setSelectedFpo(null); }} 
                className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-sm cursor-pointer"
                style={{ minHeight: '44px' }}
              >
                ⬅️ Back to List
              </button>
              <span className="text-gray-400 text-xs">RythuSandhi AI Navigation</span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                    Govt Registered FPO
                  </span>
                  <h4 className="font-extrabold text-base text-emerald-950 mt-1">
                    {selectedFpo.name}
                  </h4>
                  <p className="text-stone-600 flex items-center mt-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-700 shrink-0" />
                    {selectedFpo.district}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs block">
                    {selectedFpo.memberFarmers} Farmers
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">Active Network</span>
                </div>
              </div>
            </div>

            {/* Aggregation Logistics Hub */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2">
              <h5 className="font-bold text-xs text-stone-900 flex items-center">
                <Building className="w-4 h-4 mr-1 text-emerald-800" />
                Cluster Aggregation Hub & Cold Storage
              </h5>
              <p className="text-stone-700 font-medium">
                {selectedFpo.aggregationCenter}
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Reefer collection trucks arrive weekly for bulk dispatch. Yields from farmers with 0.5 to 2 acres are pooled and quality-graded here to fulfill corporate 5-tonne purchase minimums.
              </p>
            </div>

            {/* Crops Handled */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
              <h5 className="font-bold text-xs text-stone-900 mb-1.5">
                Crops Collected & Aggregated:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedFpo.cropsHandled.map((crop, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-100/90 text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-emerald-300 text-xs"
                  >
                    ✓ {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-emerald-950 text-white rounded-xl p-3.5 border border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 uppercase font-bold">Authorized Coordinator</span>
                  <h5 className="font-bold text-sm text-white">{selectedFpo.contactPerson}</h5>
                  <p className="text-xs text-emerald-200 font-mono mt-0.5">{selectedFpo.phone}</p>
                </div>

                <a
                  href={`tel:${selectedFpo.phone.replace(/\s+/g, '')}`}
                  className="h-11 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call FPO Lead</span>
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedFpo(null)}
                className="h-12 px-4 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>⬅️ Back to All FPOs</span>
              </button>

              <button
                type="button"
                onClick={handleCloseAll}
                className="h-12 px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Done / Return to App
              </button>
            </div>
          </div>
        ) : (
          /* FPO LIST VIEW */
          <>
            {/* Info Banner */}
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Why join an FPO?</strong> Institutional buyers require minimum 5–10 tonne container loads. Smallholder farmers (0.5 to 2 acres) in Andhra Pradesh & Telangana combine yields at these verified hubs to secure full corporate contract rates without middlemen cuts.
            </div>

            {/* FPO List */}
            <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3 divide-y divide-stone-100 flex-1">
              {FPO_CLUSTERS.map((fpo) => (
                <div key={fpo.id} className="pt-3 first:pt-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-sm text-emerald-950">{fpo.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                          Govt Registered
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-emerald-700" />
                        {fpo.district}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
                      {fpo.memberFarmers} Farmers
                    </span>
                  </div>

                  <div className="mt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-700">
                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block uppercase font-medium">Crops Aggregated</span>
                      <span className="font-semibold text-emerald-900">{fpo.cropsHandled.join(', ')}</span>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block uppercase font-medium">Aggregation Yard</span>
                      <span className="font-semibold text-stone-800">{fpo.aggregationCenter}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-1">
                    <div className="text-xs text-stone-600">
                      <span className="font-medium">{fpo.contactPerson}</span>
                      <span className="text-stone-400 mx-1.5">•</span>
                      <span className="font-mono text-emerald-800">{fpo.phone}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedFpo(fpo)}
                        className="h-10 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={`tel:${fpo.phone.replace(/\s+/g, '')}`}
                        className="h-10 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={handleCloseAll}
                className="h-11 px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs"
              >
                Close Window
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

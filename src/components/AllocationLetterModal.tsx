'use client';

import React from 'react';
import { AllocationAssignment } from '@/types';
import { Printer, Download, X, Building2, CheckCircle2, Shield, QrCode } from 'lucide-react';

interface AllocationLetterModalProps {
  assignment: AllocationAssignment;
  onClose: () => void;
}

export const AllocationLetterModal: React.FC<AllocationLetterModalProps> = ({
  assignment,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const verificationHash = `VRF-${assignment.studentRoll}-${assignment.bedId}-${assignment.id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Official Hostel Allocation Letter (Module M9)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letter Document Body */}
        <div
          id="printable-allocation-letter"
          className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 font-serif leading-relaxed text-sm"
        >
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-sans font-bold text-xl">
                🏛️
              </div>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Residential Life & Hostel Administration
            </h1>
            <p className="text-xs uppercase font-sans tracking-widest text-slate-600 font-semibold">
              Office of the Dean of Student Welfare • Allotment Secretariat
            </p>
            <p className="text-[11px] font-sans text-slate-500 mt-0.5">
              Ref: HO/ALLOC/2026/ODD-{assignment.studentRoll} • Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold uppercase underline tracking-wide font-sans text-slate-900">
              Hostel Allotment & Occupancy Authorization Letter
            </h2>
            <p className="text-xs font-sans text-slate-500">Academic Session 2026–2027 (Odd Semester)</p>
          </div>

          {/* Letter Salutation */}
          <p className="mb-4">
            To,<br />
            <strong>{assignment.studentName}</strong> (Roll No: <code>{assignment.studentRoll}</code>)<br />
            School of Engineering & Applied Sciences
          </p>

          <p className="mb-4 text-justify">
            Dear Student,<br />
            We are pleased to inform you that subsequent to the automated policy-driven allocation process and comprehensive warden review, you have been officially allocated residential accommodation as per the following approved details:
          </p>

          {/* Allotment Details Table */}
          <div className="my-6 border border-slate-300 rounded-lg overflow-hidden font-sans text-xs">
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
              <div className="p-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Allocated Hall of Residence</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.hostelName}</span>
              </div>
              <div className="p-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Room & Bed Identifier</span>
                <span className="font-bold text-indigo-700 text-sm">
                  Room {assignment.roomNumber}, Bed {assignment.bedCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200 bg-white">
              <div className="p-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Room Specification</span>
                <span className="font-semibold text-slate-800">
                  {assignment.roomType.replace('_', ' ')} (Floor {assignment.floorNumber})
                </span>
              </div>
              <div className="p-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Roommate(s)</span>
                <span className="font-semibold text-slate-800">
                  {assignment.roommateRollNumbers.length > 0
                    ? assignment.roommateRollNumbers.join(', ')
                    : 'Single Occupancy'}
                </span>
              </div>
            </div>
          </div>

          {/* Important Check-in Instructions */}
          <div className="mb-6 text-xs space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200 font-sans">
            <h4 className="font-bold uppercase text-slate-800 text-[11px] mb-1">Check-in Guidelines & Formalities:</h4>
            <p>1. Report to the Hall Caretaker's desk between <strong>August 14 – August 18, 2026 (09:00 AM – 05:00 PM)</strong>.</p>
            <p>2. Carry a printed copy of this letter, student photo identity card, and fee payment receipt.</p>
            <p>3. Room inventory checklist (bed, study table, chair, closet) must be signed upon key receipt.</p>
            <p>4. Subletting, unauthorized guests, and room exchanges without recorded warden approval are strictly prohibited under Hall Code Section 9.</p>
          </div>

          {/* Signatures and QR Code */}
          <div className="pt-6 border-t border-slate-300 flex items-center justify-between font-sans">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-slate-300 rounded bg-slate-50 text-center">
                <QrCode className="w-12 h-12 text-slate-800" />
                <span className="text-[8px] font-mono text-slate-500 block mt-0.5">SCAN TO VERIFY</span>
              </div>
              <div className="text-[10px] text-slate-500">
                <p>Digital Token: <code className="font-mono text-slate-800">{verificationHash}</code></p>
                <a
                  href={`/verify?token=${encodeURIComponent(verificationHash)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline block mt-0.5 print:hidden"
                >
                  Verify Authenticity Online ↗
                </a>
                <p className="mt-0.5">Certified by Institutional Allocation Engine (P03)</p>
                <p>Recorded in Immutable University Audit Registry</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-800 pb-1 mb-1 font-serif italic text-slate-700 font-bold">
                Dr. S. Sharma / Prof. V. Raman
              </div>
              <p className="text-xs font-bold text-slate-900">Chief Warden & DSW Secretariat</p>
              <p className="text-[10px] text-slate-500">Hostel Affairs Committee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

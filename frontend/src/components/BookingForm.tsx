"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createAppointment } from "../../lib/api";
import type { ExpertBio } from "../../lib/types";

const TIME_OPTIONS = [
  { value: "", label: "Select preferred time (optional)" },
  { value: "morning", label: "Morning (9am–12pm)" },
  { value: "afternoon", label: "Afternoon (12pm–5pm)" },
  { value: "evening", label: "Evening (5pm–8pm)" },
  { value: "anytime", label: "Anytime" },
];

interface BookingFormProps {
  expert: ExpertBio;
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export default function BookingForm({
  expert,
  onSuccess,
  onLoginClick,
}: BookingFormProps) {
  const [preferred_date, setPreferred_date] = useState("");
  const [preferred_time, setPreferred_time] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!preferred_date.trim()) {
      setError("Please choose a preferred date.");
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment({
        expert: expert.id,
        preferred_date: preferred_date.trim(),
        preferred_time: preferred_time.trim() || undefined,
        message: message.trim() || undefined,
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-poppins font-semibold text-brand-blue">
          Request submitted
        </p>
        <p className="mt-2 text-sm text-gray-700 font-inter">
          Your booking request with {expert.name} has been sent. You’ll receive
          a confirmation once it’s reviewed. You can view the status under{" "}
          <Link
            href="/users/appointments"
            className="text-brand-blue hover:text-brand-orange underline"
          >
            My appointments
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="font-poppins text-lg font-bold text-brand-blue mb-4">
        Request a session with {expert.name}
      </h3>
      <p className="text-sm text-gray-600 font-inter mb-4">
        Share your preferred date and time. We’ll get back to you to confirm.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="booking-date"
            className="block text-sm font-medium text-gray-700 font-inter mb-1"
          >
            Preferred date <span className="text-red-500">*</span>
          </label>
          <input
            id="booking-date"
            type="date"
            value={preferred_date}
            onChange={(e) => setPreferred_date(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-inter focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            required
          />
        </div>

        <div>
          <label
            htmlFor="booking-time"
            className="block text-sm font-medium text-gray-700 font-inter mb-1"
          >
            Preferred time
          </label>
          <select
            id="booking-time"
            value={preferred_time}
            onChange={(e) => setPreferred_time(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-inter focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value || "none"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="booking-message"
            className="block text-sm font-medium text-gray-700 font-inter mb-1"
          >
            Message (optional)
          </label>
          <textarea
            id="booking-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. topic you’d like to discuss or questions"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-inter focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-inter">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white font-inter hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}

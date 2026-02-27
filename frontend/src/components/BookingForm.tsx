"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createAppointment } from "../../lib/api";
import type { ExpertBio } from "../../lib/types";

const labelClass =
  "block text-sm font-medium text-gray-700 font-plex mb-1";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-plex text-gray-900 placeholder:text-gray-600 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";
const textareaClass = inputClass + " resize-y";

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
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [requested_experts, setRequested_experts] = useState("");
  const [session_date_time, setSession_date_time] = useState("");
  const [focus, setFocus] = useState("");
  const [key_questions, setKey_questions] = useState("");
  const [desired_format, setDesired_format] = useState("");
  const [attendee_count, setAttendee_count] = useState("");
  const [attendee_who, setAttendee_who] = useState("");
  const [attendee_genai_familiarity, setAttendee_genai_familiarity] = useState("");
  const [model_access, setModel_access] = useState("");
  const [additional_notes, setAdditional_notes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Your email is required.");
      return;
    }
    if (!focus.trim()) {
      setError("Please confirm the topic/focus for this session.");
      return;
    }
    if (!key_questions.trim()) {
      setError("Please share key questions or focus areas.");
      return;
    }
    if (!desired_format.trim()) {
      setError("Please share the desired format for this session.");
      return;
    }
    if (!attendee_count.trim() || !attendee_who.trim() || !attendee_genai_familiarity.trim()) {
      setError("Please complete all attendee details (how many, who will attend, and GenAI familiarity).");
      return;
    }
    if (!model_access.trim()) {
      setError("Please share what models attendees can access.");
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment({
        expert: Number(expert.id),
        email: email.trim(),
        company: company.trim() || undefined,
        requested_experts: requested_experts.trim() || undefined,
        session_date_time: session_date_time.trim() || undefined,
        focus: focus.trim(),
        key_questions: key_questions.trim(),
        desired_format: desired_format.trim(),
        attendee_count: attendee_count.trim() || undefined,
        attendee_who: attendee_who.trim() || undefined,
        attendee_genai_familiarity: attendee_genai_familiarity.trim() || undefined,
        model_access: model_access.trim(),
        additional_notes: additional_notes.trim() || undefined,
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
    const calendlyBaseUrl = process.env.NEXT_PUBLIC_CALENDLY_EXPERT_SESSION_URL;
    const calendlyUrl = calendlyBaseUrl
      ? (() => {
          try {
            const url = new URL(calendlyBaseUrl);
            url.searchParams.set("email", email.trim());
            return url.toString();
          } catch {
            return calendlyBaseUrl;
          }
        })()
      : null;

    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-didot font-semibold text-brand-blue">
          Request submitted
        </p>
        <p className="mt-2 text-sm text-gray-700 font-plex">
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
        {calendlyUrl && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm font-medium text-gray-700 font-plex mb-2">
              Pick your session time
            </p>
            <p className="text-xs text-gray-600 font-plex mb-3">
              Choose a date and time that works for you. Your email will be
              pre-filled.
            </p>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white font-plex hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Open calendar to pick a time
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="font-didot text-lg font-bold text-brand-blue mb-2">
        Book a session
      </h3>
      <p className="text-sm text-gray-600 font-plex mb-1">
        For Expert Sessions — to maximize your time with Feedforward experts,
        please provide the following information in advance of your session.
      </p>
      <p className="text-sm text-gray-600 font-plex mb-4">
        Contact{" "}
        <a
          href="mailto:maddie@feedforward.ai"
          className="text-brand-blue hover:text-brand-orange underline"
        >
          maddie@feedforward.ai
        </a>{" "}
        with any questions.
      </p>
      <p className="text-xs text-gray-500 font-plex mb-4">* Required</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="booking-email" className={labelClass}>
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="e.g. name@company.com"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-company" className={labelClass}>
            Company
          </label>
          <input
            id="booking-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            placeholder="Company or organization"
          />
        </div>

        <div>
          <label htmlFor="booking-requested-experts" className={labelClass}>
            1. Requested Expert(s)
          </label>
          <textarea
            id="booking-requested-experts"
            rows={2}
            value={requested_experts}
            onChange={(e) => setRequested_experts(e.target.value)}
            className={textareaClass}
            placeholder="Specify expert(s) you wish to engage, or leave blank for team recommendations"
          />
        </div>

        <div>
          <label htmlFor="booking-session-date-time" className={labelClass}>
            2. Session Date/Time
          </label>
          <input
            id="booking-session-date-time"
            type="text"
            value={session_date_time}
            onChange={(e) => setSession_date_time(e.target.value)}
            className={inputClass}
            placeholder="Preferred dates and times, or a range"
          />
        </div>

        <div>
          <label htmlFor="booking-focus" className={labelClass}>
            3. Focus <span className="text-red-500">*</span>
          </label>
          <textarea
            id="booking-focus"
            rows={2}
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className={textareaClass}
            placeholder="High-level theme or topic (e.g., workforce and skill transformation)"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-key-questions" className={labelClass}>
            4. Key questions <span className="text-red-500">*</span>
          </label>
          <textarea
            id="booking-key-questions"
            rows={3}
            value={key_questions}
            onChange={(e) => setKey_questions(e.target.value)}
            className={textareaClass}
            placeholder="Key questions or focus areas for the session"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-desired-format" className={labelClass}>
            5. Desired Format <span className="text-red-500">*</span>
          </label>
          <textarea
            id="booking-desired-format"
            rows={2}
            value={desired_format}
            onChange={(e) => setDesired_format(e.target.value)}
            className={textareaClass}
            placeholder="e.g. Fireside chat, presentation with Q&A"
            required
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-3">
          <span className="block text-sm font-medium text-gray-700 font-plex">
            6. Attendee details <span className="text-red-500">*</span>
          </span>
          <div>
            <label htmlFor="booking-attendee-count" className="text-xs text-gray-600 font-plex mb-0.5 block">
              How many people will attend (approximate is OK)?
            </label>
            <input
              id="booking-attendee-count"
              type="text"
              value={attendee_count}
              onChange={(e) => setAttendee_count(e.target.value)}
              className={inputClass}
              placeholder="e.g. 15"
              required
            />
          </div>
          <div>
            <label htmlFor="booking-attendee-who" className="text-xs text-gray-600 font-plex mb-0.5 block">
              Who will attend (names and/or role types)?
            </label>
            <textarea
              id="booking-attendee-who"
              rows={2}
              value={attendee_who}
              onChange={(e) => setAttendee_who(e.target.value)}
              className={textareaClass}
              placeholder="Attendee names and/or roles"
              required
            />
          </div>
          <div>
            <label htmlFor="booking-attendee-genai" className="text-xs text-gray-600 font-plex mb-0.5 block">
              What is their level of familiarity with GenAI (e.g., low, medium, high)?
            </label>
            <input
              id="booking-attendee-genai"
              type="text"
              value={attendee_genai_familiarity}
              onChange={(e) => setAttendee_genai_familiarity(e.target.value)}
              className={inputClass}
              placeholder="e.g. low, medium, high"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="booking-model-access" className={labelClass}>
            7. Model Access <span className="text-red-500">*</span>
          </label>
          <textarea
            id="booking-model-access"
            rows={2}
            value={model_access}
            onChange={(e) => setModel_access(e.target.value)}
            className={textareaClass}
            placeholder="Models attendees can access (e.g. GPT-5.0, Gemini 2.5, Claude, Co-Pilot, internal tools)"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-additional-notes" className={labelClass}>
            8. Additional Notes
          </label>
          <textarea
            id="booking-additional-notes"
            rows={3}
            value={additional_notes}
            onChange={(e) => setAdditional_notes(e.target.value)}
            className={textareaClass}
            placeholder="Additional notes or goals for the session"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-plex">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-medium text-white font-plex hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}

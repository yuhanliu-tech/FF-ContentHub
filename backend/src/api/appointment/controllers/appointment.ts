/**
 * appointment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::appointment.appointment",
  ({ strapi }) => ({
    /**
     * Create: set user from JWT so users can't book as someone else.
     */
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to request an appointment.");
      }
      const body = ctx.request.body?.data ?? ctx.request.body;
      const {
        expert,
        email,
        company,
        requested_experts,
        session_date_time,
        preferred_date,
        preferred_time,
        focus,
        key_questions,
        desired_format,
        attendee_count,
        attendee_who,
        attendee_genai_familiarity,
        model_access,
        additional_notes,
        message,
      } = body;
      if (!expert) {
        return ctx.badRequest("expert is required.");
      }
      if (!email || typeof email !== "string" || !email.trim()) {
        return ctx.badRequest("email is required.");
      }
      if (!focus || typeof focus !== "string" || !focus.trim()) {
        return ctx.badRequest("focus is required.");
      }
      if (!key_questions || typeof key_questions !== "string" || !key_questions.trim()) {
        return ctx.badRequest("key_questions is required.");
      }
      if (!desired_format || typeof desired_format !== "string" || !desired_format.trim()) {
        return ctx.badRequest("desired_format is required.");
      }
      if (!model_access || typeof model_access !== "string" || !model_access.trim()) {
        return ctx.badRequest("model_access is required.");
      }
      const entity = await strapi.documents("api::appointment.appointment").create({
        data: {
          expert: typeof expert === "object" ? expert.id : expert,
          user: user.id,
          email: email.trim(),
          company: company?.trim() ?? null,
          requested_experts: requested_experts?.trim() ?? null,
          session_date_time: session_date_time?.trim() ?? null,
          preferred_date: preferred_date ?? null,
          preferred_time: preferred_time ?? null,
          focus: focus.trim(),
          key_questions: key_questions.trim(),
          desired_format: desired_format.trim(),
          attendee_count: attendee_count?.trim() ?? null,
          attendee_who: attendee_who?.trim() ?? null,
          attendee_genai_familiarity: attendee_genai_familiarity?.trim() ?? null,
          model_access: model_access.trim(),
          additional_notes: additional_notes?.trim() ?? null,
          message: message?.trim() ?? null,
          status: "requested",
        },
      });
      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    },

    /**
     * Find: only return the current user's appointments.
     */
    async find(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to view appointments.");
      }
      ctx.query = {
        ...ctx.query,
        filters: { ...(ctx.query.filters as object), user: { id: user.id } },
      };
      return super.find(ctx);
    },

    /**
     * Find one: only if it belongs to the current user.
     */
    async findOne(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to view this appointment.");
      }
      const documentId = ctx.params.documentId ?? ctx.params.id;
      if (!documentId) return ctx.badRequest("documentId or id required");
      const entity = await strapi.documents("api::appointment.appointment").findOne({
        documentId,
        populate: { expert: true, user: true },
      });
      if (!entity) {
        return ctx.notFound();
      }
      const entityWithUser = entity as typeof entity & { user?: { id: number } };
      const entityUserId = entityWithUser.user?.id;
      if (entityUserId !== user.id) {
        return ctx.forbidden("You can only view your own appointments.");
      }
      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    },
  })
);

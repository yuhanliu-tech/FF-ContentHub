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
      const { expert, preferred_date, preferred_time, message } = body;
      if (!expert || !preferred_date) {
        return ctx.badRequest("expert and preferred_date are required.");
      }
      const entity = await strapi.documents("api::appointment.appointment").create({
        data: {
          expert: typeof expert === "object" ? expert.id : expert,
          user: user.id,
          preferred_date,
          preferred_time: preferred_time ?? null,
          message: message ?? null,
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

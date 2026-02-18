/**
 * favourite controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::favourite.favourite",
  ({ strapi }) => ({
    /**
     * Toggle a favourite: if the user already favourited this document, remove it;
     * otherwise, create a new favourite entry.
     * POST /api/favourites/toggle
     * Body: { documentId: string }
     */
    async toggle(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const { documentId } = ctx.request.body;
      if (!documentId) {
        return ctx.badRequest("documentId is required");
      }

      // Check if this favourite already exists for this user + document
      const existing = await strapi
        .documents("api::favourite.favourite")
        .findMany({
          filters: {
            user: { id: user.id },
            document: { documentId: documentId },
          },
          limit: 1,
        });

      if (existing && existing.length > 0) {
        // Remove the favourite
        await strapi
          .documents("api::favourite.favourite")
          .delete({
            documentId: existing[0].documentId,
          });
        return ctx.send({ favourited: false });
      } else {
        // Create the favourite
        await strapi
          .documents("api::favourite.favourite")
          .create({
            data: {
              user: user.id,
              document: documentId,
            },
          });
        return ctx.send({ favourited: true });
      }
    },

    /**
     * Get all favourite documents for the authenticated user.
     * GET /api/favourites/me
     */
    async findMine(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const favourites = await strapi
        .documents("api::favourite.favourite")
        .findMany({
          filters: {
            user: { id: user.id },
          },
          populate: {
            document: {
              populate: ["file"],
            },
          },
        });

      // Extract the document data from each favourite record
      const documents = favourites
        .map((fav: any) => fav.document)
        .filter(Boolean);

      return ctx.send({ data: documents });
    },
  })
);
